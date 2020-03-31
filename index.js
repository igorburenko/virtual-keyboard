class VirtualKeyboard {
  constructor() {
    this.elements = {};

    this.virtualKeyboardLayout = '';

    this.props = {
      textValue: '',
      capsLock: false,
    };

    this.keyLayout = {
      eng: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
        'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter',
        'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
        'ctrl', 'alt', 'ru', 'Space',
      ],
      ru: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
        'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ё',
        'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter',
        'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '/',
        'ctrl', 'alt', 'eng', 'Space',
      ],
      eventCode: ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
        'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash',
        'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
        'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash',
        'ControlLeft', 'AltLeft', 'lang', 'Space',
      ],
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
    this.lang = window.localStorage.lang || 'eng';
    this.elements.keysWrapper.appendChild(this.makeKeys(this.lang));

    this.elements.keyboard = document.createElement('div');
    this.elements.keyboard.classList.add('keyboard');
    this.elements.keyboard.append(this.elements.keysWrapper);

    this.elements.wrapper.append(this.elements.inputWindow);
    this.elements.wrapper.append(this.elements.keyboard);

    document.body.append(this.elements.wrapper);

    this.virtualKeyboardLayout = document.querySelector('.keyboard__keys');
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
    this.keyLayout[language].forEach((value, index) => {
      const keyElement = document.createElement('button');
      const addBrTag = ['Backspace', '\\', 'Enter', '/', 'ё'].indexOf(value) !== -1;
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('key');
      keyElement.id = this.keyLayout.eventCode[index];

      switch (value) {
        case 'Backspace':
          keyElement.classList.add('key_wide');
          break;

        case 'CapsLock':
          keyElement.classList.add('key_wide', 'caps');
          break;

        case 'Enter':
          keyElement.classList.add('key_wide');
          break;

        case 'Shift':
          keyElement.classList.add('key_shift-wide');
          break;
        case 'Tab':
          keyElement.classList.add('key_middle-wide');
          break;

        case 'Space':
          keyElement.classList.add('key_space');
          break;

        case 'ctrl':
        case 'alt':
          keyElement.classList.add('key_ctrl');
          break;

        case 'ru':
        case 'eng':
          keyElement.classList.add('key_lang');
          break;

        default:
          keyElement.classList.add('caps-key');
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

  renderNewKeyboard() {
    this.elements.newKeysWrapper = document.createElement('div');
    this.elements.newKeysWrapper.classList.add('keyboard__keys');
    this.elements.newKeysWrapper.appendChild(this.makeKeys(window.localStorage.lang));
    this.elements.oldKeyboard = document.querySelector('.keyboard__keys');
    this.elements.oldKeyboard.replaceWith(this.elements.newKeysWrapper);
    this.toggleVirtualKeys();
  }

  changeLanguage() {
    if (window.localStorage.lang === 'eng') {
      window.localStorage.lang = 'ru';
    } else {
      window.localStorage.lang = 'eng';
    }
    this.renderNewKeyboard();
  }

  toggleHardwareKeys() {
    document.addEventListener('keydown', (event) => {
      this.keyboardKeyDown(event);
    });
    document.addEventListener('keyup', (event) => {
      this.keyboardKeyUp(event);
    });
  }

  toggleVirtualKeys() {
    this.virtualKeyboardLayout = document.querySelector('.keyboard__keys');
    this.virtualKeyboardLayout.addEventListener('mousedown', (event) => {
      this.keyboardKeyDown({ code: event.target.id, key: event.target.innerText });
    });
    this.virtualKeyboardLayout.addEventListener('mouseup', (event) => {
      this.keyboardKeyUp({ code: event.target.id, key: event.target.innerText });
    });
  }

  keyboardKeyDown(event) {
    if (event.code !== 'CapsLock') {
      this.pressedKey = document.querySelector(`#${event.code}`);
      this.pressedKey.classList.add('key_pressed');
    }

    switch (event.code) {
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

      case 'ShiftLeft':
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
      case 'lang':
        this.changeLanguage();
        break;

      default:
        this.props.textValue += this.props.capsLock ? event.key.toUpperCase() : event.key;
        this.printToWindow();
        break;
    }
  }

  keyboardKeyUp(event) {
    switch (event.code) {
      case 'CapsLock':
        this.shiftkKey = document.querySelector('#ShiftLeft').classList.contains('key_pressed');
        if (this.props.capsLock && !this.shiftkKey) {
          this.toggleCapsLock();
        }
        break;

      case 'ShiftLeft':
        this.capsLockKey = document.querySelector('.caps').classList.contains('key_hold');
        if (!this.capsLockKey) {
          this.props.capsLock = false;
        }
        this.makeCharUp();
        this.unpressedKey = document.querySelector(`#${event.code}`);
        this.unpressedKey.classList.remove('key_pressed');
        break;

      default:
        this.unpressedKey = document.querySelector(`#${event.code}`);
        this.unpressedKey.classList.remove('key_pressed');
        break;
    }
  }
}

window.onload = function () {
  const keyboard = new VirtualKeyboard();
  keyboard.init();
  keyboard.toggleHardwareKeys();
  keyboard.toggleVirtualKeys();
};
