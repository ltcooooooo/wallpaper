import { computed, defineProps, ref, defineEmits } from 'vue'
// import { defineProps, ref, defineEmits } from "vue";

export const useTabs = (pageTabs) => {
    const show = ref(false);
    const handleClick = () => {
        show.value = !show.value;
        if (show.value) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }
    };

    const handleClickOutside = (event) => {
        if (!pageTabs.value.contains(event.target)) {
            show.value = false;
            document.removeEventListener("click", handleClickOutside);
        }
    };
    return {
        show,
        handleClick
    }
}

export const usePage = (tabOptions) => {
    const currentComponent = computed(() => {
        return tabOptions.value.find(item => item.active).component
    })

    const changeTab = (name) => {
        for (const item of tabOptions.value) {
            if (item.name === name) {
                item.active = true
            } else {
                item.active = false
            }
        }
    }
    return {
        currentComponent,
        changeTab
    }
}