import Swal from 'sweetalert2';

export const confirmDeletion = (callback) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
            confirmButton: 'bg-red-500 text-white font-medium py-2 px-5 mx-2 rounded hover:bg-red-600',
            cancelButton: 'bg-green-500 text-white font-medium py-2 px-5 mx-2 rounded hover:bg-green-600',
        },
        buttonsStyling: false,
    }).then((result) => {
        if (result.isConfirmed) {
            callback();

            // SUCCESS ALERT → YOU MUST ADD customClass AGAIN HERE
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700",
                },
                buttonsStyling: false,
            });
        }
    });
};
