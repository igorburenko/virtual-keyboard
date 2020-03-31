class VirtualKeyboard {
  constructor() {
    this.elements = {};

    this.props = {
      textValue: '',
      capsLock: false,
      lang: 'eng',
    };

    this.keyLayout = {
      eng: {
        Backquote: '`', Digit1: '1', Digit2: '2', Digit3: '3',
      }
      // eng: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      //   'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      //   'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter',
      //   'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
      //   'ctrl', 'alt', 'ru', 'Space', //'alt', 'ctrl',
      // ],
      // ru: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      //   'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ё',
      //   'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter',
      //   'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '/',
      //   'ctrl', 'alt', 'eng', 'Space',// 'alt', 'ctrl',
      // ],
    };
  }

  init() {
    this.elements.wrapper = document.createElement('div');
    this.elements.wrapper.classList.add('wrapper');

    this.elements.inputWindow = document.createElement('div');
    this.elements.inputWindow.classList.add('input-window');
    this.elements.inputArea = document.createElement('textarea');
    this.elements.inputArea.setAttribute('disabled', 'disabled');

    this.elements.inputArea.classList.add('input-area');
    this.elements.inputArea.value = this.props.textValue;
    this.elements.inputWindow.append(this.elements.inputArea);

    this.elements.keysWrapper = document.createElement('div');
    this.elements.keysWrapper.classList.add('keyboard__keys');
    this.elements.keysWrapper.appendChild(this.makeKeys());

    this.elements.keyboard = document.createElement('div');
    this.elements.keyboard.classList.add('keyboard');
    this.elements.keyboard.append(this.elements.keysWrapper);

    this.elements.wrapper.append(this.elements.inputWindow);
    this.elements.wrapper.append(this.elements.keyboard);

    document.body.append(this.elements.wrapper);
  }

  printToWindow() {
    document.querySelector('.input-area').value = this.props.textValue;
  }

  toggleCapsLock() {
    this.props.capsLock = !this.props.capsLock;
    this.makeCharUp();
    document.querySelector('.caps').classList.toggle('key_hold');
  }

  makeCharUp() {
    this.elements.keys = document.querySelectorAll('.caps-key');
    this.elements.keys.forEach((val, index) => {
      if (val.textContent.length === 1) {
        this.elements.keys[index].textContent = this.props.capsLock ? val.textContent.toUpperCase()
          : val.textContent.toLowerCase();
      }
    });
  }

  makeKeys(language = 'eng') {
    this.fragment = document.createDocumentFragment();
    this.keyLayout[language].forEach((value) => {
      const keyElement = document.createElement('button');
      const addBrTag = ['Backspace', '\\', 'Enter', '/', 'ё'].indexOf(value) !== -1;
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('key');
      keyElement.id = value;

      switch (value) {
        case 'Backspace':
          keyElement.classList.add('key_wide');
          keyElement.addEventListener('click', () => {
            this.props.textValue = this.props.textValue
              .substring(0, this.props.textValue.length - 1);
            this.printToWindow();
          });
          break;

        case 'CapsLock':
          keyElement.classList.add('key_wide', 'caps');
          if (this.props.capsLock) {
            keyElement.classList.add('key_hold');
          }
          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
          });
          break;

        case 'Enter':
          keyElement.classList.add('key_wide');
          keyElement.addEventListener('click', () => {
            this.props.textValue += '\n';
          });
          break;

        case 'Shift':
          keyElement.classList.add('key_shift-wide');
          keyElement.addEventListener('click', () => {
            console.log(`clicked to ${value}`);
          });
          break;
        case 'Tab':
          keyElement.classList.add('key_middle-wide');
          keyElement.addEventListener('click', () => {
            this.props.textValue += '   ';
            this.printToWindow();
          });
          break;

        case 'Space':
          keyElement.classList.add('key_space');
          keyElement.addEventListener('click', () => {
            this.props.textValue += ' ';
            this.printToWindow();
          });
          break;

        case 'ctrl':
        case 'alt':
          keyElement.classList.add('key_ctrl');
          keyElement.addEventListener('click', () => {
          });
          break;

        case 'ru':
        case 'eng':
          keyElement.classList.add('key_lang');
          keyElement.addEventListener('click', () => {
            this.changeLanguage();
          });
          break;

        default:
          keyElement.classList.add('caps-key');
          keyElement.addEventListener('click', () => {
            this.props.textValue += this.props.capsLock ? value.toUpperCase() : value;
            this.printToWindow();
          });
          break;
      }
      keyElement.textContent = this.props.capsLock && keyElement.classList.contains('caps-key')
        ? value.toUpperCase() : value;
      this.fragment.appendChild(keyElement);
      if (addBrTag) {
        this.fragment.appendChild(document.createElement('br'));
      }
    });
    return this.fragment;
  }

  renderNewLangKeyboard() {
    this.elements.newKeysWrapper = document.createElement('div');
    this.elements.newKeysWrapper.classList.add('keyboard__keys');
    this.elements.newKeysWrapper.appendChild(this.makeKeys(this.props.lang));
    this.elements.oldKeyboard = document.querySelector('.keyboard__keys');
    this.elements.oldKeyboard.replaceWith(this.elements.newKeysWrapper);
  }

  changeLanguage() {
    if (this.props.lang === 'eng') {
      this.props.lang = 'ru';
    } else {
      this.props.lang = 'eng';
    }
    this.renderNewLangKeyboard();
  }

  toggleHardwareKeys() {
    document.addEventListener('keydown', (event) => {
      this.hardwareKeyboardKeyDown(event);
    });
    document.addEventListener('keyup', (event) => {
      this.hardwareKeyboardKeyUp(event);
    });
  }

  hardwareKeyboardKeyDown(event) {
    if (event.key !== 'CapsLock') {
      this.pressedKey = document.querySelector(`#${event.key}`);
      this.pressedKey.classList.add('key_pressed');
    }

    switch (event.key) {
      case 'Backspace':
        this.props.textValue = this.props.textValue
          .substring(0, this.props.textValue.length - 1);
        this.printToWindow();
        break;

      case 'CapsLock':
        if (!this.props.capsLock) {
          this.toggleCapsLock();
        }
        break;

      case 'Enter':
        this.props.textValue += '\n';
        this.makeCharUp();
        break;

      case 'Shift':
        this.props.capsLock = true;
        this.makeCharUp();
        break;

      case 'Tab':
        this.props.textValue += '   ';
        this.printToWindow();
        break;

      case 'Space':
        this.props.textValue += ' ';
        this.printToWindow();
        break;
      //
      // case 'ctrl':
      // case 'alt':
      //   keyElement.classList.add('key_ctrl');
      //   keyElement.addEventListener('click', () => {
      //   });
      //   break;
      //
      // case 'ru':
      // case 'eng':
      //   keyElement.classList.add('key_lang');
      //   keyElement.addEventListener('click', () => {
      //     this.changeLanguage();
      //   });
      //   break;
      default:
        this.props.textValue += this.props.capsLock ? event.key.toUpperCase() : event.key;
        this.printToWindow();
        break;
    }
  }


  hardwareKeyboardKeyUp(event) {
    switch (event.key) {
      case 'CapsLock':
        this.toggleCapsLock();
        break;
      case 'Shift':
        this.capsLockKey = document.querySelector('.caps').classList.contains('key_hold');
        if (!this.capsLockKey) {
          this.props.capsLock = false;
        }
        this.makeCharUp();
        this.unpressedKey = document.querySelector(`#${event.key}`);
        this.unpressedKey.classList.remove('key_pressed');
        break;
      default:
        console.log(event);
        this.unpressedKey = document.querySelector(`#${event.key}`);
        this.unpressedKey.classList.remove('key_pressed');
        break;
    }
  }
}


window.onload = function () {
  const keyboard = new VirtualKeyboard();
  keyboard.init();
  keyboard.toggleHardwareKeys();
};
