<script setup>
import { Link, Head, useForm } from "@inertiajs/vue3";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    footer: {
        type: Object,
        required: true
    }
});

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Footer", href: "/footer" },
    { title: "Edit", href: `/footer/${props.footer.id}/edit` },
];

const form = useForm({
    _method: 'PUT',
    logo: null,
    description_en: props.footer.description_en || '',
    description_bn: props.footer.description_bn || '',
    office_address_en: props.footer.office_address_en || '',
    office_address_bn: props.footer.office_address_bn || '',
    mobile_en: props.footer.mobile_en || '',
    mobile_bn: props.footer.mobile_bn || '',
    hotline_en: props.footer.hotline_en || '',
    hotline_bn: props.footer.hotline_bn || '',
    image: null,
    copyright: props.footer.copyright || '',
});

const logoPreview = ref(null);
const imagePreview = ref(null);

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
};

onMounted(() => {
    if (props.footer.logo) {
        logoPreview.value = getImageUrl(props.footer.logo);
    }
    if (props.footer.image) {
        imagePreview.value = getImageUrl(props.footer.image);
    }
});

const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'logo') {
        form.logo = file;
        logoPreview.value = URL.createObjectURL(file);
    } else if (type === 'image') {
        form.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const removeFile = (type) => {
    if (type === 'logo') {
        form.logo = null;
        logoPreview.value = null; // Also clear preview to indicate removal? 
        // Note: If we want to delete existing image on server, we might need a separate flag or API call.
        // For now, this just clears the *new* file selection or hides the preview.
        // If user wants to delete existing image, we might need a "delete" button that sets a flag like `delete_logo: true`.
        // But usually "uploading null" doesn't delete existing unless we explicitly handle it.
        // Let's assume this just resets the input for now, but if they want to remove existing, we show existing again?
        // Let's just restore existing if available or clear if it was a new upload.
        if (props.footer.logo) {
             logoPreview.value = getImageUrl(props.footer.logo);
        } else {
             logoPreview.value = null;
        }
    } else if (type === 'image') {
        form.image = null;
         if (props.footer.image) {
             imagePreview.value = getImageUrl(props.footer.image);
        } else {
             imagePreview.value = null;
        }
    }
};

const submit = () => {
    form.post(route('footer.update', props.footer.id), {
        preserveScroll: true,
        onSuccess: () => {
            // handled by page reload
        }
    });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Edit Footer Item" />

        <div class="lg:w-full mx-auto p-4 sm:p-2 lg:p-8">
            <div class="mb-4">
                <Button variant="ghost" as-child>
                    <Link :href="route('footer.index')">
                        <ArrowLeft class="mr-2 h-4 w-4" /> Back to List
                    </Link>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Edit Footer Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <!-- Logo Upload -->
                        <div class="space-y-2">
                            <Label>Logo</Label>
                            <div class="flex items-center gap-4">
                                <div 
                                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer w-32 h-32 flex flex-col items-center justify-center relative"
                                    @click="$refs.logoInput.click()"
                                >
                                    <template v-if="logoPreview">
                                        <img :src="logoPreview" class="w-full h-full object-contain" alt="Logo preview" />
                                        <button 
                                            v-if="form.logo"
                                            @click.stop="removeFile('logo')"
                                            type="button"
                                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X class="w-4 h-4" />
                                        </button>
                                    </template>
                                    <template v-else>
                                        <ImageIcon class="w-8 h-8 text-gray-400 mb-2" />
                                        <span class="text-xs text-gray-500">Change Logo</span>
                                    </template>
                                </div>
                                <input 
                                    ref="logoInput"
                                    type="file" 
                                    class="hidden" 
                                    accept="image/*"
                                    @change="(e) => handleFileChange(e, 'logo')"
                                />
                            </div>
                            <span v-if="form.errors.logo" class="text-sm text-red-500">{{ form.errors.logo }}</span>
                        </div>

                        <!-- Descriptions -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="description_en">Description (English)</Label>
                                <Textarea id="description_en" v-model="form.description_en" placeholder="Enter description in English" rows="4" />
                                <span v-if="form.errors.description_en" class="text-sm text-red-500">{{ form.errors.description_en }}</span>
                            </div>
                            
                            <div class="space-y-2">
                                <Label for="description_bn">Description (Bengali)</Label>
                                <Textarea id="description_bn" v-model="form.description_bn" placeholder="Enter description in Bengali" rows="4" />
                                <span v-if="form.errors.description_bn" class="text-sm text-red-500">{{ form.errors.description_bn }}</span>
                            </div>
                        </div>

                        <!-- Office Address -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="office_address_en">Office Address (English)</Label>
                                <Textarea id="office_address_en" v-model="form.office_address_en" placeholder="Enter office address in English" rows="3" />
                                <span v-if="form.errors.office_address_en" class="text-sm text-red-500">{{ form.errors.office_address_en }}</span>
                            </div>
                            
                            <div class="space-y-2">
                                <Label for="office_address_bn">Office Address (Bengali)</Label>
                                <Textarea id="office_address_bn" v-model="form.office_address_bn" placeholder="Enter office address in Bengali" rows="3" />
                                <span v-if="form.errors.office_address_bn" class="text-sm text-red-500">{{ form.errors.office_address_bn }}</span>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="mobile_en">Mobile (English)</Label>
                                <Input id="mobile_en" v-model="form.mobile_en" placeholder="Enter mobile number" />
                                <span v-if="form.errors.mobile_en" class="text-sm text-red-500">{{ form.errors.mobile_en }}</span>
                            </div>
                            
                            <div class="space-y-2">
                                <Label for="mobile_bn">Mobile (Bengali)</Label>
                                <Input id="mobile_bn" v-model="form.mobile_bn" placeholder="Enter mobile number" />
                                <span v-if="form.errors.mobile_bn" class="text-sm text-red-500">{{ form.errors.mobile_bn }}</span>
                            </div>

                            <div class="space-y-2">
                                <Label for="hotline_en">Hotline (English)</Label>
                                <Input id="hotline_en" v-model="form.hotline_en" placeholder="Enter hotline number" />
                                <span v-if="form.errors.hotline_en" class="text-sm text-red-500">{{ form.errors.hotline_en }}</span>
                            </div>
                            
                            <div class="space-y-2">
                                <Label for="hotline_bn">Hotline (Bengali)</Label>
                                <Input id="hotline_bn" v-model="form.hotline_bn" placeholder="Enter hotline number" />
                                <span v-if="form.errors.hotline_bn" class="text-sm text-red-500">{{ form.errors.hotline_bn }}</span>
                            </div>
                        </div>

                        <!-- Copyright & Image -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div class="space-y-2">
                                <Label>Footer Image</Label>
                                <div class="flex items-center gap-4">
                                    <div 
                                        class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer w-full h-32 flex flex-col items-center justify-center relative"
                                        @click="$refs.imageInput.click()"
                                    >
                                        <template v-if="imagePreview">
                                            <img :src="imagePreview" class="w-full h-full object-contain" alt="Image preview" />
                                            <button 
                                                v-if="form.image"
                                                @click.stop="removeFile('image')"
                                                type="button"
                                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X class="w-4 h-4" />
                                            </button>
                                        </template>
                                        <template v-else>
                                            <ImageIcon class="w-8 h-8 text-gray-400 mb-2" />
                                            <span class="text-xs text-gray-500">Change Footer Image</span>
                                        </template>
                                    </div>
                                    <input 
                                        ref="imageInput"
                                        type="file" 
                                        class="hidden" 
                                        accept="image/*"
                                        @change="(e) => handleFileChange(e, 'image')"
                                    />
                                </div>
                                <span v-if="form.errors.image" class="text-sm text-red-500">{{ form.errors.image }}</span>
                            </div>

                            <div class="space-y-2">
                                <Label for="copyright">Copyright Text</Label>
                                <Input id="copyright" v-model="form.copyright" placeholder="Enter copyright text" />
                                <span v-if="form.errors.copyright" class="text-sm text-red-500">{{ form.errors.copyright }}</span>
                            </div>
                        </div>

                        <div class="flex justify-end pt-4">
                            <Button type="submit" :disabled="form.processing">
                                {{ form.processing ? 'Updating...' : 'Update Footer Item' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
