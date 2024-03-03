import {ui} from "../ui/layaMaxUI";
import Handler = Laya.Handler;
import Label = Laya.Label;
import Box = Laya.Box;
import Button = Laya.Button;
import Image = Laya.Image;
import Tween = Laya.Tween;

/**
 * 测试panel+list
 */
export default class TestPanelCloud extends ui.test.TestPanelCloudUI {
	constructor() {
		super();
	}

	private _max = 10;
	private _actList: number[] = [1];

	private getShowList(): number[] {
		const list = this._actList.sort((a, b) => a - b);
		if (list.length >= this._max) {
			return list;
		}
		const maxNum = list[list.length - 1];
		return [...list, maxNum + 1];
	}

	onEnable() {
		super.onEnable();
		this.list.renderHandler = Handler.create(this, this.onRenderList, undefined, false);
		this.list.vScrollBarSkin = "";
		const ary: any[] = this.getShowList();
		this.list.array = ary.reverse();
		this.list.scrollTo(ary.length);
	}

	private onRenderList(item: Box, index: number): void {
		const data: number = item.dataSource;
		const labLayer = <Label>item.getChildByName("labLayer");
		labLayer.text = `第${data}层`;
		const btn = <Button>item.getChildByName("btn");
		btn.clickHandler = Handler.create(this, this.onClickBtn, [item, index], false);
		const isActed = this._actList.indexOf(data) > -1;
		const boxCloud = <Box>item.getChildByName("boxCloud");
		const imgCloud1 = <Image>boxCloud.getChildAt(0);
		const imgCloud2 = <Image>boxCloud.getChildAt(1);
		boxCloud.visible = !isActed;
		if (!isActed) {
			imgCloud1.x = 0;
			imgCloud2.x = 300;
		}
		btn.visible = !isActed;
	}

	private onClickBtn(item: Box, index: number): void {
		const data: number = item.dataSource;
		if (this._actList.indexOf(data) < 0) {
			this._actList.push(data);
		}
		const boxCloud = <Box>item.getChildByName("boxCloud");
		const imgCloud1 = <Image>boxCloud.getChildAt(0);
		const imgCloud2 = <Image>boxCloud.getChildAt(1);
		Tween.to(imgCloud1, {x: imgCloud1.x - 500}, 1000);
		Tween.to(imgCloud2, {x: imgCloud2.x + 500}, 1000, null,
			Handler.create(this, this.tweenList, [index - 2], true));
		const btn = <Button>item.getChildByName("btn");
		btn.visible = false;
	}

	private tweenList(index: number) {
		const child = this.list.array.length;
		if (child < this._max) {
			const newList = this.getShowList();
			const maxNum = newList[newList.length - 1];
			this.list.addItemAt(maxNum, 0);
			this.list.scrollTo(1);
		}
		this.list.tweenTo(index - 1, 500);
	}
}