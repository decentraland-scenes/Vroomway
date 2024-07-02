// additions to allow collections for set management,
// lists and dictionaries
// raw source: Dominik Marciniszyn, codetain.com
export type IKeyCollection<T> = {
  size: () => number
  getKeys: () => string[]
  containsKey: (key: string) => boolean
  addItem: (key: string, value: T) => undefined
  getItem: (key: string) => T
  removeItem: (key: string) => T
  values: () => T[]
}
export class List<T> {
  private items: T[]

  constructor() {
    this.items = []
  }

  size(): number {
    return this.items.length
  }

  addItem(value: T): void {
    this.items.push(value)
  }

  getItem(index: number): T {
    return this.items[index]
  }

  // assigns the given <e> instance to targeted position in array
  assignItem(pos: number, instance: T): void {
    this.items[pos] = instance
  }

  // removes the selected element from the list, maintaining the order of elements
  removeItem(value: T): void {
    // shift selected element to last spot in array
    var i: number = 0
    var tmp: T
    while (i < this.items.length) {
      // if end of list
      if (i === this.items.length - 1) {
        this.items.pop()
        return
      }

      // if item is found
      if (this.items[i] === value) {
        // swap targeted element with next element in list
        tmp = this.items[i]
        this.items[i] = this.items[i + 1]
        this.items[i + 1] = tmp
      }
      // force next case
      i++
    }
  }
}
export default class Dictionary<T> implements IKeyCollection<T> {
  private items: Record<string, T> = {}
  private count: number = 0

  size(): number {
    return this.count
  }

  getKeys(): string[] {
    const keySet: string[] = []

    for (const property in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, property)) {
        keySet.push(property)
      }
    }

    return keySet
  }

  containsKey(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.items, key)
  }

  addItem(key: string, value: T): undefined {
    if (!Object.prototype.hasOwnProperty.call(this.items, key)) {
      this.count++
    }

    this.items[key] = value
  }

  getItem(key: string): T {
    return this.items[key]
  }

  removeItem(key: string): T {
    const value = this.items[key]

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.items[key]
    this.count--

    return value
  }

  values(): T[] {
    const values: T[] = []

    for (const property in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, property)) {
        values.push(this.items[property])
      }
    }

    return values
  }
}
export { Dictionary }
