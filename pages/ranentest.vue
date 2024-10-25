<template>
<div>
    <EditEvent/>
</div>
<div>
    <div v-if="fun" class="flex justify-center items-center h-screen">
        <Button type="button" variant="primary" @click="showDialog = true">
            Show Dialog
        </Button>
    </div>
    <Dialog :open="showDialog" v-else>
        <DialogContent>
            <DialogHeader>
                <DialogTitle class="tw-text-xl">hi</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                hi
            </DialogDescription>
            <DialogFooter class="sm:justify-start">
                <DialogClose as-child>
                    <Button type="button" variant="secondary" @click="closeDialog">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</div>
</template>

<script>
import { ref } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditEvent } from '@/components/custom/edit-event';

export default {
    components: {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
        DialogClose,
        Button
    },
    setup() {
        const showDialog = ref(true); // Set to true to automatically show the dialog
        const status = ref('Status');
        const description = ref('Description');
        const fun = ref(false);

        const closeDialog = () => {
            showDialog.value = false;
        };

        return {
            showDialog,
            status,
            description,
            closeDialog,
            fun,
        };
    }
};
</script>