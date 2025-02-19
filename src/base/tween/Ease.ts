import { EaseNone, IEase } from "./TweenConst";

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

const Linear: IEase = {
  in: EaseNone,
  out: EaseNone,
  inOut: EaseNone,
};

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
