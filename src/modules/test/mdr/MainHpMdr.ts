import { ui } from "@ui/layaMaxUI";

const HP_RES_ARY: string[] = [
  "hp/img_hp1.png",
  "hp/img_hp2.png",
  "hp/img_hp3.png",
  "hp/img_hp4.png",
  "hp/img_hp5.png",
  "hp/img_hp6.png",
];

const HP_RES_END: string = "hp/img_hp7.png";
const HP_SINGLE: number = 1000;

/**随机整数*/
function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**随机血量*/
function createMaxHp(): number {
  return getRandom(10, 15) * 1000;
}

/**随机减血*/
function createSubHp(): number {
  return getRandom(0, 1000);
}

/**
 * 血条
 */
export class MainHpMdr extends ui.hp.MainHpUI {
  private _maxHp: number;
  private _leftHp: number;
  private _radio: number = 0;
  private _hpResIdx = 0;

  constructor() {
    super();
  }

  public onAwake(): void {
    super.onAwake();
  }

  public onEnable(): void {
    super.onEnable();
    this._maxHp = createMaxHp();
    this._leftHp = this._maxHp;
    this._radio = 1;
    this.timerLoop(500, this, this.onUpdateHp);
  }

  private onUpdateHp(): void {
    this._leftHp -= createSubHp();
    if (this._leftHp < 0) {
      this._leftHp = this._maxHp = createMaxHp();
    }
    const radio = this._leftHp / this._maxHp;
    if (radio === this._radio) {
      return;
    }
    this._radio = radio;
    console.log(this._radio);
    this.updateLabHp();
    this.updateHpSkin();
  }

  private updateLabHp(): void {
    const num = (this._leftHp / this._maxHp) * 100;
    this.labHp.text =
      "x" + Math.ceil(this._leftHp / HP_SINGLE) + "    " + num.toFixed(2) + "%";
  }

  private updateHpSkin(): void {
    if (this._hpResIdx >= HP_RES_ARY.length) {
      this._hpResIdx = 0;
    }
    this.imgHp.skin = HP_RES_ARY[this._hpResIdx++];
  }
}
