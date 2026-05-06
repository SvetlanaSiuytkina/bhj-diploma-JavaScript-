/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleButton = document.querySelector(".sidebar-toggle");
    
    toggleButton.addEventListener("click", event => {
      event.preventDefault();
      document.body.classList.toggle("sidebar-open");
      document.body.classList.toggle("sidebar-collapse");
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginButton = document.querySelector(".menu-item_login a");

    if (loginButton) {
      loginButton.addEventListener("click", event => {
        event.preventDefault();

        const modal = this.apply.getModal("login");
        if (modal) modal.open();
      });
    }

    const registerButton = document.querySelector(".menu-item_register a");
    if (registerButton) {
      registerButton.addEventListener('click', event => {
        event.preventDefault();

        const modal = App.getModal('register');
        if (modal) modal.open();
      });
    }
    
    const logoutButton = document.querySelector('.menu-item_logout a');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();

        User.logout((err, success) => {
          if (success) {
            App.setState('init');
          }
        });
      });
    }
  }
}