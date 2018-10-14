let coin = 300;

class Trump {
    constructor(number) {
        const trumpID = ResourceManager.image.load(`trump.png`);
        this.image = new TileImage(trumpID, 64, 96, 32 * number, 0, 32, 48);
        this.number = number;
    }

    /**
     * @param {Context} ctx
     */
    render(ctx, x, y) {
        this.image.render(ctx, x, y);
    }

    clone() {
        return new Trump(this.number);
    }
}

class Sort {
    constructor(name, x, y, score) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = 0;
        this.score = score;
        this.color = `red`;

        this.done = false;
    }

    setTrumps(trumps) {
        /**
         * @type {Array<Trump>}
         */
        this.trumps = trumps;
        this.done = false;
    }

    /**
     * @param {number} dt
     * @return {boolean}
     */
    update(dt) {
        if (Input.mouse.isPress(Input.mouse.mLeft()) || Input.mouse.isPress(Input.mouse.mRight())) {
            const x = Input.mouse.getMouseX();
            const y = Input.mouse.getMouseY();
            if (this.x < x && x < this.x + this.width && this.y - 20 < y && y < this.y + 20) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {Context} ctx
     */
    render(ctx) {
        this.width = ctx.measureText(this.name, 30);
        ctx.fillRect(this.x - 10, this.y - 20, this.width + 20, 40, this.color);
        ctx.fillText(this.name, this.x, this.y, 0.0, 0.5, 30, `white`);
        ctx.fillText(`x${this.score}`, this.x + 300, this.y, 0.0, 0.5, 30, `white`);
    }

    /**
     * @protected
     * @return {Sort}
     */
    makeClone() {}

    /**
     * @return {Sort}
     */
    clone() {
        const ret = this.makeClone();
        ret.x = this.x;
        ret.y = this.y;
        ret.name = this.name;
        ret.width = this.width;
        ret.score = this.score;
        return ret;
    }

    /**
     * @return {boolean}
     */
    equals(target) {
        return target instanceof Sort && target.name === this.name;
    }

    /**
     * @return {boolean}
     */
    step() {}
}

class BabbleSort extends Sort {
    constructor(x, y) {
        super(`バブルソート`, x, y, 5);
        this.STATE = {
            COMPARE: 0,
        };
        this.sortPhase = this.STATE.COMPARE;
        this.compareIndex = 0;
        this.dirty = true;
    }

    step() {
        if (this.compareIndex === this.trumps.length - 1) {
            this.compareIndex = 0;
            if (this.dirty) {
                return true;
            }
            this.dirty = true;
        }
        if (this.trumps[this.compareIndex].number > this.trumps[this.compareIndex + 1].number) {
            const tmp = this.trumps[this.compareIndex];
            this.trumps[this.compareIndex] = this.trumps[this.compareIndex + 1];
            this.trumps[this.compareIndex + 1] = tmp;
            this.dirty = false;
        }
        this.compareIndex++;
        return false;
    }

    /**
     * @protected
     * @return {Sort}
     */
    makeClone() {
        return new BabbleSort();
    }
}

class QuickSort extends Sort {
    constructor(x, y) {
        super(`クイックソート`, x, y, 2);

        this.pivot = 0;
        this.right = 0;
        this.left = 0;
        this.leftCheck = true;

        this.rightChild = null;
        this.leftChild = null;
    }

    setTrumps(trumps) {
        super.setTrumps(trumps);
        this.pivot = this.trumps[0].number;
        this.left = 0;
        this.right = this.trumps.length - 1;
    }


    render(ctx) {
        super.render(ctx);
    }
    step() {
        if (this.trumps.length <= 1) {
            return true;
        }
        if (this.rightChild !== null) {
            const trumps = [];
            for (const it of this.leftChild.trumps) {
                trumps.push(it);
            }
            for (const it of this.rightChild.trumps) {
                trumps.push(it);
            }
            for (let i = 0; i < this.trumps.length; ++i) {
                this.trumps[i] = trumps[i];
            }
            const right = this.rightChild.step();
            if (right) {
                const left = this.leftChild.step();
                if (left) {
                    const trumps = [];
                    for (const it of this.leftChild.trumps) {
                        trumps.push(it);
                    }
                    for (const it of this.rightChild.trumps) {
                        trumps.push(it);
                    }
                    for (let i = 0; i < this.trumps.length; ++i) {
                        this.trumps[i] = trumps[i];
                    }
                    return true;
                }
            }
            return false;
        }
        if (this.left <= this.right) {
            if (this.leftCheck) {
                const l = this.trumps[this.left];
                if (l.number >= this.pivot) {
                    this.leftCheck = false;
                    console.log(`Left:${this.left}`);
                }
                this.left++;
            } else {
                const r = this.trumps[this.right];
                if (r.number < this.pivot) {
                    console.log(`Left:${this.left}`);
                    console.log(`Right:${this.right}`);
                    const temp = this.trumps[this.right];
                    this.trumps[this.right] = this.trumps[this.left - 1];
                    this.trumps[this.left - 1] = temp;
                    this.leftCheck = true;
                }
                this.right--;
            }
        } else {
            const rights = [];
            const lefts = [];
            for (let i = 0; i < this.left; ++i) {
                lefts.push(this.trumps[i]);
            }
            for (let i = this.left; i < this.trumps.length; ++i) {
                rights.push(this.trumps[i]);
            }
            console.log(this.trumps);
            console.log(this.left);
            console.log(lefts);
            console.log(rights);
            this.rightChild = new QuickSort();
            this.rightChild.setTrumps(rights);
            this.leftChild = new QuickSort();
            this.leftChild.setTrumps(lefts);
        }
        return false;
    }

    /**
     * @protected
     * @return {Sort}
     */
    makeClone() {
        return new QuickSort();
    }
}

class BogoSort extends Sort {
    constructor(x, y) {
        super(`ボゴソート`, x, y, 100);
        this.STATE = {
            COMPARE: 0,
            BOGO: 1,
        };
        this.sortPhase = this.STATE.COMPARE;
        this.compareIndex = 0;
    }

    step() {
        switch (this.sortPhase) {
            case this.STATE.COMPARE:
                if (this.compareIndex === this.trumps.length - 1) {
                    return true;
                }
                if (this.trumps[this.compareIndex].number > this.trumps[this.compareIndex + 1].number) {
                    this.sortPhase = this.STATE.BOGO;
                }
                this.compareIndex++;
                break;
            case this.STATE.BOGO:
                for (var i = this.trumps.length - 1; i > 0; i--) {
                    var r = Math.floor(Math.random() * (i + 1));
                    var tmp = this.trumps[i];
                    this.trumps[i] = this.trumps[r];
                    this.trumps[r] = tmp;
                }
                this.compareIndex = 0;
                this.sortPhase = this.STATE.COMPARE;
                return this.step();
        }
        return false;
    }

    /**
     * @protected
     * @return {Sort}
     */
    makeClone() {
        return new BogoSort();
    }
}

class SortScene extends Scene {
    constructor(trumps, sorts, target) {
        super();
        /**
         * @type {Array<Array<Trump>>}
         */
        this.trumps = [];
        for (let i = 0; i < sorts.length; ++i) {
            this.trumps.push([]);
        }
        for (const it of trumps) {
            for (let i = 0; i < this.trumps.length; ++i) {
                const list = this.trumps[i];
                list.push(it.clone());
            }
        }
        /**
         * @type {Array<Sort>}
         */
        this.sorts = [];
        for (let i = 0; i < sorts.length; ++i) {
            const it = sorts[i];
            const clone = it.clone();
            clone.x = 10;
            clone.y = 10 + 200 * i;
            clone.setTrumps(this.trumps[i]);
            if (!clone.equals(target)) {
                clone.color = `black`;
            }
            this.sorts.push(clone);
        }

        /**
         * @type {Sort}
         */
        this.target = target;
    }

    update(dt) {
        if (Input.mouse.isPress(Input.mouse.mLeft())) {
            for (const it of this.sorts) {
                if (it.step()) {
                    it.done = true;
                }
            }
        }
    }

    /**
     * @param {Context} ctx
     */
    render(ctx) {
        for (let i = 0; i < this.sorts.length; ++i) {
            const sort = this.sorts[i];
            sort.render(ctx);
            for (let j = 0; j < sort.trumps.length; ++j) {
                const it = sort.trumps[j];
                it.render(ctx, 200 + j * 70, i * 200 + 50);
            }
            if (sort.done) {
                ctx.fillText(`Finish`, 400, i * 200 + 100, 0.5, 0.5, 100, `red`);
            }
        }
    }
}

class GameScene extends Scene {
    constructor() {
        super();
        /**
         * @type {Array<Trump>}
         */
        this.trumps = [];

        /**
         * @type {Array<Sort>}
         */
        this.sorts = [];

        const member = Math.random() * 5 + 3;
        for (let i = 0; i < member; ++i) {
            this.trumps.push(new Trump(Math.floor(Math.random() * 13)));
        }
        this.sorts.push(new QuickSort(200, 400));
        this.sorts.push(new BabbleSort(200, 450));
        this.sorts.push(new BogoSort(200, 500));
    }
    /**
     * @param {number} dt
     */
    update(dt) {
        for (const it of this.sorts) {
            if (it.update(dt)) {
                SceneManager.it.pushScene(new SortScene(this.trumps, this.sorts, it));
                break;
            }
        }
    }

    /**
     * @param {Context} ctx
     */
    render(ctx) {
        ctx.fillText(`残りのお金 : ${coin}`, 10, 10, 0.0, 0.0, 25, `white`);
        ctx.fillText(`カード`, 10, 100, 0.0, 0.0, 40, `white`);
        for (let i = 0; i < this.trumps.length; ++i) {
            const it = this.trumps[i];
            it.render(ctx, 200 + i * 70, 100);
        }
        ctx.fillText(`早いのは？`, 400, 300, 0.5, 0.5, 40, `white`);
        for (let i = 0; i < this.sorts.length; ++i) {
            const it = this.sorts[i];
            ctx.fillText(`競走馬${i}`, 10, 400 + i * 50, 0.0, 0.5, 30, `white`);
            it.render(ctx);
        }
    }
}

class TitleScene extends Scene {
    /**
     * @param {number} dt
     */
    update(dt) {
        if (Input.mouse.isPress(Input.mouse.mRight()) || Input.mouse.isPress(Input.mouse.mLeft()) || Input.mouse.isPress(Input.mouse.mCenter())) {
            SceneManager.it.replaceScene(new GameScene());
        }
    }

    /**
     * @param {Context} ctx
     */
    render(ctx) {
        ctx.fillText(`Sort Battle`, 400, 300, 0.5, 0.5, 100, `white`);
        ctx.fillText(`クリックしてスタート`, 400, 500, 0.5, 0.5, 30, `white`);
    }
}

new UnderEngineBuilder().build().execute(new TitleScene());
