import { $authHost, $host } from "./index";

export const createPetProduct = async (petProduct) => {
    try {
        const { data } = await $authHost.post('api/petProduct', petProduct);
        return data;
    } catch (error) {
        console.error("Error creating pet product:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchProducts = async (page, limit, typeId = null, categoryId = null, searchQuery = "") => {
    try {
        const { data } = await $host.get('/api/petProduct', {
            params: {
                page,
                limit,
                typeId,
                categoryId,
                name: searchQuery
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw error;
    }
};


export const deletePetProduct = async (id) => {
    try {
        const { data } = await $authHost.delete(`api/petProduct/${id}`);
        return data;
    } catch (error) {
        console.error("Error during product deletion:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchOnePetProduct = async (id) => {
    try {
        const { data } = await $host.get(`api/petProduct/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching single pet product:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchOrders = async () => {
    try {
        const { data } = await $host.get('/api/orders');
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
        throw error;
    }
};


export const fetchTypes = async () => {
    try {
        const { data } = await $host.get('/api/type');
        return data;
    } catch (error) {
        console.error("Error fetching types:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchCategores  = async () => {
    try {
        const { data } = await $host.get('/api/category');
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        throw error;
    }
};


export const createType = async (type) => {
    try {
        const { data } = await $authHost.post('api/type', type);
        return data;
    } catch (error) {
        console.error("Error creating type:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteType = async (id) => {
    try {
        const { data } = await $authHost.delete(`api/type/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting type:", error.response?.data || error.message);
        throw error;
    }
};


export const deleteOrder = async (orderId) => {
    try {
        const { data } = await $host.delete(`/api/orders/${orderId}`);
        return data;
    } catch (error) {
        console.error("Error deleting order:", error.response?.data || error.message);
        throw error;
    }
};


export const createCategory = async (category) => {
    try {
        const { data } = await $authHost.post('api/category', category);
        return data;
    } catch (error) {
        console.error("Error creating category:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const { data } = await $authHost.delete(`api/category/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting category:", error.response?.data || error.message);
        throw error;
    }
};
