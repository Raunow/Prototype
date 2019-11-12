export class Queue<T> {
	private queue: Array<T> = [];
	private offset = 0;

	getLength(): number {
		return this.queue.length - this.offset;
	}

	isEmpty(): boolean {
		return this.queue.length === 0;
	}

	enqueue(item: T): void {
		this.queue.push(item);
	}

	dequeue(): T {
		if (this.queue.length == 0) return undefined;

		var item = this.queue[this.offset];

		if (++this.offset * 2 >= this.queue.length) {
			this.queue = this.queue.slice(this.offset);
			this.offset = 0;
		}

		return item;
	}

	peek(): T {
		return this.queue.length > 0 ? this.queue[this.offset] : undefined;
	}
}