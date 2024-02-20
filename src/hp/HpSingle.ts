import {ui} from "../ui/layaMaxUI";
import {MathUtils} from "../utils/MathUtils";
import Handler = Laya.Handler;

export default class HpSingle extends ui.hp.HpSingleUI {
    private _maxHp = 0;
    private _maxHp1 = 0;

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this._maxHp = this._maxHp1 = 100000;
        this.timer.loop(500, this, this.onUpdateHp);
    }

    private onUpdateHp(): void {
        const subHp = MathUtils.getRandom(0, 5000);
        this._maxHp1 = this._maxHp1 - subHp;

        console.log(`11111 ${this._maxHp1}, ${this._maxHp1 / this._maxHp}`);
        const w = 500 * (this._maxHp1 / this._maxHp);
        Laya.Tween.to(this.imgHp, {width: w}, 500, null, Handler.create(this, () => {
            if (w <= 0) {
                this.timer.clearAll(this);
            }
        }));
    }
}