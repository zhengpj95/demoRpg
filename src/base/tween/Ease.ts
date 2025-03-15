import { EaseNone, IEase } from "./TweenConst";

/**线性运动*/
const Linear: IEase = {
  in: EaseNone,
  out: EaseNone,
  inOut: EaseNone,
};

/**平方，动画开始和结束时都比较平稳，中间的速度较快*/
const Quad: IEase = {
  in: function (t) {
    return t * t;
  },
  out: function (t) {
    return t * (2 - t);
  },
  inOut: function (t) {
    if (t < 0.5) {
      return 2 * t * t;
    } else {
      return 1 - 2 * (1 - t) * (1 - t);
    }
  },
};

/**三次方，动画的加速度更强，尤其是在开始阶段或结束阶段*/
const Cubic: IEase = {
  in: function (t) {
    return t * t * t;
  },
  out: function (t) {
    return 1 - Math.pow(1 - t, 3);
  },
  inOut: function (t) {
    if (t < 0.5) {
      return 4 * t * t * t;
    } else {
      return 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  },
};

/**四次方，类似Quad，效果更显著*/
const Quart: IEase = {
  in: function (t) {
    return t * t * t * t;
  },
  out: function (t) {
    return 1 - Math.pow(1 - t, 4);
  },
  inOut: function (t) {
    if (t < 0.5) {
      return 8 * t * t * t * t;
    } else {
      return 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
  },
};

/**五次方，类似Quad，效果更显著*/
const Quint: IEase = {
  in: function (t) {
    return t * t * t * t * t;
  },
  out: function (t) {
    return 1 - Math.pow(1 - t, 5);
  },
  inOut: function (t) {
    if (t < 0.5) {
      return 16 * t * t * t * t * t;
    } else {
      return 1 - Math.pow(-2 * t + 2, 5) / 2;
    }
  },
};

/**六次方，类似Quad，效果更显著*/
const Strong: IEase = {
  in: function (t) {
    return t * t * t * t * t * t;
  },
  out: function (t) {
    return 1 - Math.pow(1 - t, 6);
  },
  inOut: function (t) {
    if (t < 0.5) {
      return 16 * t * t * t * t * t * t;
    } else {
      return 1 - Math.pow(-2 * t + 2, 6) / 2;
    }
  },
};

/**正弦，基于正弦波的缓动效果，平滑的过渡*/
const Sine: IEase = {
  in: function (t) {
    return 1 - Math.cos((t * Math.PI) / 2);
  },
  out: function (t) {
    return Math.sin((t * Math.PI) / 2);
  },
  inOut: function (t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },
};

const BackNum = 1.70158; //回弹强度系数
/**回退，在动画开始或结束时，物体会稍微往回跳一下，然后才进入正常的动画效果，给人一种“回弹”的感觉*/
const Back: IEase = {
  in: (t) => t * t * ((BackNum + 1) * t - BackNum),
  out: function (t) {
    t -= 1;
    return t * t * ((BackNum + 1) * t + BackNum) + 1;
  },
  inOut: function (t) {
    const s = 1.70158 * 1.525; // 调整回弹强度
    if (t < 0.5) {
      return (t * 2 * t * ((s + 1) * t * 2 - s)) / 2;
    } else {
      t = t * 2 - 2;
      return (t * t * ((s + 1) * t + s) + 2) / 2;
    }
  },
};

/**圆形，基于园的数学原理，动画开始时速度较慢，结束时速度较快，感觉像是沿着圆弧运动*/
const Circ: IEase = {
  in: (t) => 1 - Math.sqrt(1 - t * t),
  out: (t) => Math.sqrt(1 - (t - 1) * (t - 1)),
  inOut: (t) => {
    if (t < 0.5) {
      return (1 - Math.sqrt(1 - 2 * t * (2 * t))) / 2;
    } else {
      return (Math.sqrt(1 - 2 * (1 - t) * (2 * (1 - t))) + 1) / 2;
    }
  },
};

/**弹跳，模拟弹跳效果，物体在接近目标时会回弹几次，直到最终停下*/
const Bounce: IEase = {
  in: (t) => 1 - Math.abs(Math.cos(t * Math.PI) * (1 - t)),
  out: (t) => Math.abs(Math.cos(t * Math.PI) * t),
  inOut: (t) => {
    if (t < 0.5) {
      return (1 - Math.abs(Math.cos(t * Math.PI) * (1 - t))) / 2;
    } else {
      return (Math.abs(Math.cos(t * Math.PI) * t) + 1) / 2;
    }
  },
};

/**弹性，具有弹簧效果的缓动，物体会在目标位置上反复震荡，逐渐减小幅度，直到最终停下来*/
const Elastic: IEase = {
  in: (t) => -Math.exp(-t) * Math.cos(t * 2 * Math.PI),
  out: (t) => Math.exp(-t) * Math.cos(t * 2 * Math.PI),
  inOut: (t) => {
    if (t < 0.5) {
      return -0.5 * Math.exp(-2 * t) * Math.cos(t * 2 * Math.PI);
    } else {
      return 0.5 * Math.exp(-2 * (1 - t)) * Math.cos((1 - t) * 2 * Math.PI);
    }
  },
};

/**指数，动画的开始或结束速度非常快，石适用于快速变化的效果*/
const Expo: IEase = {
  in: (t) => Math.pow(2, 10 * (t - 1)),
  out: (t) => 1 - Math.pow(2, -10 * t),
  inOut: (t) => {
    if (t < 0.5) {
      return 0.5 * Math.pow(2, 10 * (t - 1));
    } else {
      return 0.5 * (2 - Math.pow(2, -10 * (2 * t - 1)));
    }
  },
};

/**
 * Ease函数
 * @author zpj
 * @date @date 2025/2/19
 */
export class Ease {
  public static Quad = Quad;
  public static Linear = Linear;
  public static Cubic = Cubic;
  public static Quart = Quart;
  public static Quint = Quint;
  public static Strong = Strong;
  public static Sine = Sine;
  public static Back = Back;
  public static Circ = Circ;
  public static Bounce = Bounce;
  public static Elastic = Elastic;
  public static Expo = Expo;
}
