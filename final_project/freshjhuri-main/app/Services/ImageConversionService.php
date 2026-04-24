<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Exception;

class ImageConversionService
{
    /**
     * Convert an uploaded image to WebP format
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param int $quality
     * @return string Path to the stored WebP image
     * @throws Exception
     */
    public static function convertToWebP(
        UploadedFile $file,
        string $directory = 'images',
        int $quality = 80
    ): string {
        try {
            if (!extension_loaded('gd') || !function_exists('imagewebp')) {
                return self::storeOriginalFile($file, $directory);
            }

            // Generate a unique filename
            $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $filename = time() . '_' . str_replace(' ', '_', $filename) . '.webp';

            // Read the image using GD
            $imagePath = $file->getRealPath();
            $imageInfo = getimagesize($imagePath);

            if ($imageInfo === false) {
                throw new Exception('Unable to read image file');
            }

            // Create image resource based on mime type
            $image = self::createImageFromFile($imagePath, $imageInfo['mime']);

            if ($image === false) {
                throw new Exception('Unable to process image');
            }

            // WebP encoding in GD requires truecolor images.
            // Convert palette-based PNG/GIF images before export.
            if (!imageistruecolor($image)) {
                if (!imagepalettetotruecolor($image)) {
                    throw new Exception('Failed to convert palette image to truecolor');
                }
            }

            // Preserve transparency for PNG/GIF/WebP sources.
            imagealphablending($image, false);
            imagesavealpha($image, true);

            // Create storage directory if it doesn't exist
            $storagePath = storage_path("app/public/{$directory}");
            if (!is_dir($storagePath)) {
                mkdir($storagePath, 0755, true);
            }

            // Save as WebP
            $fullPath = $storagePath . '/' . $filename;
            $success = imagewebp($image, $fullPath, $quality);

            imagedestroy($image);

            if (!$success) {
                throw new Exception('Failed to convert image to WebP');
            }

            // Return relative path for database storage
            return "{$directory}/{$filename}";
        } catch (Exception $e) {
            throw new Exception('Image conversion failed: ' . $e->getMessage());
        }
    }

    /**
     * Store original file without conversion when GD is not available
     *
     * @param UploadedFile $file
     * @param string $directory
     * @return string
     * @throws Exception
     */
    private static function storeOriginalFile(UploadedFile $file, string $directory): string
    {
        try {
            // Generate a unique filename
            $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '_' . str_replace(' ', '_', $filename) . '.' . $extension;

            // Create storage directory if it doesn't exist
            $storagePath = storage_path("app/public/{$directory}");
            if (!is_dir($storagePath)) {
                mkdir($storagePath, 0755, true);
            }

            // Store to the public disk so files are reachable via /storage/*
            $file->storeAs($directory, $filename, 'public');

            // Return relative path for database storage
            return "{$directory}/{$filename}";
        } catch (Exception $e) {
            throw new Exception('File storage failed: ' . $e->getMessage());
        }
    }

    /**
     * Create an image resource from file
     *
     * @param string $filePath
     * @param string $mimeType
     * @return \GdImage|false
     */
    private static function createImageFromFile(string $filePath, string $mimeType)
    {
        return match ($mimeType) {
            'image/jpeg', 'image/jpg' => function_exists('imagecreatefromjpeg') ? imagecreatefromjpeg($filePath) : false,
            'image/png' => function_exists('imagecreatefrompng') ? imagecreatefrompng($filePath) : false,
            'image/gif' => function_exists('imagecreatefromgif') ? imagecreatefromgif($filePath) : false,
            'image/webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($filePath) : false,
            'image/bmp' => function_exists('imagecreatefrombmp') ? imagecreatefrombmp($filePath) : false,
            default => false,
        };
    }

    /**
     * Delete an image file
     *
     * @param string $path
     * @return bool
     */
    public static function deleteImage(string $path): bool
    {
        $normalizedPath = trim(str_replace('\\', '/', $path));
        $normalizedPath = ltrim($normalizedPath, '/');

        $candidates = [
            $normalizedPath,
            preg_replace('#^storage/#', '', $normalizedPath),
            preg_replace('#^public/#', '', $normalizedPath),
        ];

        foreach (array_unique(array_filter($candidates)) as $candidate) {
            $fullPath = storage_path("app/public/{$candidate}");
            if (file_exists($fullPath)) {
                return unlink($fullPath);
            }
        }

        return false;
    }
}
