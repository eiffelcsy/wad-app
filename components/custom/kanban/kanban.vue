<template>
    <div>
        <div class="mb-4">
        <h1 class="text-xl font-semibold">Kanban Board</h1>
        <p class="text-base text-zinc-400 dark:text-zinc-500">
            Track tasks across stages for clear progress management. Click and drag to move tasks around.  
        </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="col-auto border p-4 rounded-lg sm:col-span-1">
            <p
            class="mb-2 text-red-500 font-semibold font-sans tracking-wide"
            >
            Pending
            </p>
            <button v-if="isMobile" @click="togglePending"  type="button" class="text-gray-500">
            {{ isPendingVisible ? 'Collapse': 'Expand' }}
            </button>
            <div v-bind="isPendingVisible" v-if="isPendingVisible">
            <draggable
                tag="ul"
                group="all-tasks"
                v-model="pendingTasks"
                item-key="id"
                @end="onDragEnd"
                class="w-auto min-h-fit max-w-md dark:bg-zinc-950 rounded-lg p-4"
                :animation="200"
                ghost-class="moving-card"
                filter=".action-button"
                :empty-insert-threshold="100"
            >
                <template #item="{ element: task }">
                <li
                    class="task-item p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move transition-shadow duration-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
                >
                    {{ task.title }} - {{ task.status }}
                </li>
                </template>
            </draggable>
            </div>
        </div>
        <div class="col-auto border p-4 rounded-lg">
            <p
            class="mb-2 text-amber-500 font-semibold font-sans tracking-wide"
            >
            In Progress
            </p>
            <button v-if="isMobile" @click="toggleDoing" type="button" class="text-gray-500">
            {{ isDoingVisible ? 'Collapse': 'Expand'}}
            </button>
            <div v-if="isDoingVisible">
            <draggable
                tag="ul"
                group="all-tasks"
                v-model="doingTasks"
                item-key="id"
                @end="onDragEnd"
                class="w-auto min-h-fit max-w-md dark:bg-zinc-950 rounded-lg p-4"
                :animation="200"
                ghost-class="moving-card"
                filter=".action-button"
                :empty-insert-threshold="100"
            >
                <template #item="{ element: task }">
                <li
                    class="p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-shadow duration-300"
                >
                    {{ task.title }} - {{ task.status }}
                </li>
                </template>
            </draggable>
            </div>
        </div>
        <div class="col-auto border p-4 rounded-lg">
            <p
            class="mb-2 text-green-500 font-semibold font-sans tracking-wide"
            >
            Completed
            </p>
            <button v-if="isMobile" @click="toggleDone"  type="button" class="text-gray-500">
            {{ isDoneVisible ? 'Collapse': 'Expand' }}
            </button>
            <div v-if="isDoneVisible">
            <draggable
                tag="ul"
                group="all-tasks"
                v-model="doneTasks"
                item-key="id"
                @end="onDragEnd"
                class="w-auto min-h-fit max-w-md dark:bg-zinc-950 rounded-lg p-4"
                ghost-class="moving-card"
                :animation="200"
                :empty-insert-threshold="100"
                :hover
                filter=".action-button"
            >
                <template #item="{ element: task }">
                <li
                    class="p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move transition-shadow duration-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
                >
                    {{ task.title }} - {{ task.status }}
                </li>
                </template>
            </draggable>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import draggable from "vuedraggable";

    const supabase = useSupabaseClient();

    const pendingTasks = ref([]);
    const doingTasks = ref([]);
    const doneTasks = ref([]);

    const isPendingVisible = ref(true);
    const isDoingVisible = ref(true);
    const isDoneVisible = ref(true);
    const isMobile = ref(false);
    //const isMobile = ref(window.innerWidth < 481)

    const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
    });

    const onDragEnd = async () => {
    console.log("Tasks updated:", {
        pendingTasks: pendingTasks.value,
        doingTasks: doingTasks.value,
        doneTasks: doneTasks.value,
    });

    const allTasks = [
        ...pendingTasks.value,
        ...doingTasks.value,
        ...doneTasks.value,
    ];

    await Promise.all(
        allTasks.map((task) => {
        // Determine new status based on which list the task is in
        if (pendingTasks.value.includes(task)) {
            task.status = "pending";
        } else if (doingTasks.value.includes(task)) {
            task.status = "in_progress";
        } else if (doneTasks.value.includes(task)) {
            task.status = "completed";
        }
        return updateTaskStatus(task);
        })
    );
    };

    //get tasks from Supabase to populate pendingTasks, doingTasks, doneTasks arrays for kanban
    const fetchTasks = async () => {
    try {
        const { data: todos, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .eq("project_id", props.projectId)
        .eq("status", "pending");

        if (todosError) {
        throw new Error(todosError.message);
        }

        // populate pendingTasks array
        pendingTasks.value = Array.isArray(todos) ? todos : [];
        console.log(pendingTasks);
    } catch (error) {
        console.error("Error fetching todos:", error);
        pendingTasks.value = []; // Fallback to empty array on error
    }

    try {
        const { data: todos, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .eq("project_id", props.projectId)
        .eq("status", "in_progress");

        if (todosError) {
        throw new Error(todosError.message);
        }

        // populate doingTasks array
        doingTasks.value = Array.isArray(todos) ? todos : [];
        console.log(doingTasks);
    } catch (error) {
        console.error("Error fetching todos:", error);
        doingTasks.value = []; // Fallback to empty array on error
    }

    try {
        const { data: todos, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .eq("project_id", props.projectId)
        .eq("status", "completed");

        if (todosError) {
        throw new Error(todosError.message);
        }

        // populate doneTasks array
        doneTasks.value = Array.isArray(todos) ? todos : [];
        console.log(doneTasks);
    } catch (error) {
        console.error("Error fetching todos:", error);
        doneTasks.value = []; // Fallback to empty array on error
    }
    };

    // update status of tasks after drag-drop
    const updateTaskStatus = async (task) => {
    const { error } = await supabase
        .from("todos")
        .update({ status: task.status })
        .eq("id", task.id);

    if (error) {
        console.error("Error updating task status:", error);
    }
    };

    
    const togglePending = () =>{
        isPendingVisible.value = !isPendingVisible.value;
    }

    const toggleDoing = () => {
        isDoingVisible.value = !isDoingVisible.value;
    }
    
    const toggleDone = () => {
        isDoneVisible.value = !isDoneVisible.value;
    }

    const checkIfMobile = () => {
        if (window.innerWidth < 482){
            isMobile.value = true;
        }
        else{
            isMobile.value = false;
        }
    }

    const handleRealTimeChange = (payload) => {
        fetchTasks()
    };

    onMounted(()=>{
        fetchTasks()
        checkIfMobile()
        window.addEventListener('resize', checkIfMobile); // Update mobile state on resize
        const subscription = supabase
            .channel(`public:todos`)
            .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "todos",
                filter: `project_id=eq.${props.projectId}`,
            },
            handleRealTimeChange
            )
        .subscribe();
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', checkIfMobile); // Clean up listener
    });
    

</script>