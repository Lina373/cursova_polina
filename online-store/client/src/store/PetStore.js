import {makeAutoObservable} from "mobx";

export default class PetStore {
    constructor() {
        this._types = []
        this._categores = []
        this._petProducts = []
        this._selectedType = {}
        this._selectedCategory = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 3
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    setCategores(categores) {
        this._categores = categores
    }
    setPetProducts(petProducts) {
        this._petProducts = petProducts
    }

    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }
    setSelectedCategory(category) {
        this.setPage(1)
        this._selectedCategory = category
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    get types() {
        return this._types
    }
    get categores() {
        return this._categores
    }
    get petProducts() {
        return this._petProducts
    }
    get selectedType() {
        return this._selectedType
    }
    get selectedCategory() {
        return this._selectedCategory
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}
