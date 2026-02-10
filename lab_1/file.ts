console.log("Використання: triangle(value1, type1, value2, type2)");
console.log("Можливі типи: 'leg' (катет), 'hypotenuse' (гіпотенуза),");
console.log(
  "'adjacent angle' (прилеглий кут), 'opposite angle' (протилежний кут), 'angle' (кут при гіпотенузі)."
);

type ElementType = 'leg' | 'hypotenuse' | 'adjacent angle' | 'opposite angle' | 'angle';

function round(value: number, precision: number = 9): number {
  return parseFloat(value.toFixed(precision));
}

function triangle(value1: number, type1: ElementType, value2: number, type2: ElementType): string {
  if (arguments.length !== 4) {
    console.error("Помилка: Функція приймає рівно 4 аргументи.");
    return "failed";
  }
  if (value1 <= 0 || value2 <= 0) {
    console.error("Помилка: Значення мають бути додатними.");
    return "failed";
  }
  let a: number, b: number, c: number, alpha: number, beta: number;
  let elements: { [key: string]: number } = {};
  elements[type1] = value1;
  elements[type2] = value2;

  if (type1 === "leg" && type2 === "leg") {
    a = value1;
    b = value2;
    c = Math.sqrt(a * a + b * b);
    alpha = Math.asin(a / c) * (180 / Math.PI);
  }
  else if (elements.leg !== undefined && elements.hypotenuse !== undefined) {
    a = elements.leg;
    c = elements.hypotenuse;
    if (a >= c) {
      console.error(
        "Помилка: Катет не може бути більшим або рівним за гіпотенузу."
      );
      return "Значення катета некоректне відносно гіпотенузи.";
    }
    b = Math.sqrt(c * c - a * a);
    alpha = Math.asin(a / c) * (180 / Math.PI);
    if (b >= c) {
      console.error("Помилка: Сторона не може бути рівна гіпотенузі.");
      return "Значення сторін некоректні.";
    }
  }
  else if (elements.hypotenuse !== undefined && elements.angle !== undefined) {
    c = elements.hypotenuse;
    alpha = elements.angle;
    if (alpha <= 0 || alpha >= 90) {
      console.error("Помилка: Гострий кут має бути між 0 і 90 градусами.");
      return "Значення кута некоректне.";
    }
    let rad: number = alpha * (Math.PI / 180);
    a = c * Math.sin(rad);
    b = c * Math.cos(rad);
  }
  else if (
    elements.leg !== undefined &&
    elements["opposite angle"] !== undefined
  ) {
    a = elements.leg;
    alpha = elements["opposite angle"];
    if (alpha <= 0 || alpha >= 90) {
      console.error("Помилка: Гострий кут має бути між 0 і 90 градусами.");
      return "Значення кута некоректне.";
    }
    let rad: number = alpha * (Math.PI / 180);
    c = a / Math.sin(rad);
    b = Math.sqrt(c * c - a * a);
  }
  else if (
    elements.leg !== undefined &&
    elements["adjacent angle"] !== undefined
  ) {
    b = elements.leg;
    beta = elements["adjacent angle"];
    if (beta <= 0 || beta >= 90) {
      console.error("Помилка: Гострий кут має бути між 0 і 90 градусами.");
      return "Значення кута некоректне.";
    }
    let rad: number = beta * (Math.PI / 180);
    c = b / Math.cos(rad);
    a = Math.sqrt(c * c - b * b);
    alpha = 90 - beta;
  } else {
    console.error(
      "Помилка: Неправильні типи аргументів. Перевірте інструкцію."
    );
    return "failed";
  }
  if (alpha < 0.0001) {
    alpha = 0.0001;
    beta = 89.9999;
  } else {
    beta = 90 - alpha;
  }
  a = round(a);
  b = round(b);
  c = round(c);
  alpha = round(alpha);
  beta = round(beta);
  console.log(`Сторони трикутника: a = ${a}, b = ${b}, c = ${c}`);
  console.log(`Кути трикутника: alpha = ${alpha}, beta = ${beta}`);
  return "success";
}