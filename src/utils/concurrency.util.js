// Used for time consuming task like fetch, db query and file heavy read/write like io

export class Concurrency {

  constructor (concurrency) {
    this.queue = [];
    this.concurrency = concurrency;
    this.activeConcurrency = 0;
  }

  async push (promise) {
    if (this.activeConcurrency >= this.concurrency) {
      this.queue.push(promise);
      return;
    }
    this.__execute(promise);
  }

  async __execute (promise) {
    this.activeConcurrency++;
    try {
      await promise;
    } catch (error) {
      console.log(error);
    } finally {
      this.activeConcurrency--;
      if (!this.queue.length) return;
      this.__execute(this.queue.shift());
    }
  }
}

// const PromiseRunner = new Concurrency(3);
// promises.forEach(promise => PromiseRunner.push(promise));