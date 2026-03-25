    export const formatDate = (val: string) => {
        const iso = val;

        const date = new Date(iso + "Z");

        return date.toLocaleDateString("en-US");
    }
