/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error("Ошибка: передан пустой элемент");
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccounButton = this.element.querySelector(".create-account");
    if (createAccounButton) {
      createAccounButton.addEventListener("click", function() {
        const modal = App.getModal("createAccount");
        if (modal) {
          modal.open();
        }
      });
    }

    this.element.addEventListener("click", event => {
      const accountElement = event.target.closest(".account");

      if (accountElement) {
        this.onSelectAccount(accountElement);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItems()
   * */
  update() {
    const currentUser = User.current();
    if (!currentUser) {
      console.error("Пользователь не авторизован");
      return;
    }
    
    Account.list({}, (err, accountsResponse) => {
      if (!err && accountsResponse && accountsResponse.success) {
        this.clear();
        this.renderItems(accountsResponse.data);
      } else {
        console.error("Ошибка загрузки счетов");
      }
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountElements = this.element.querySelectorAll(".account");
    accountElements.forEach(elem => elem.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const activeAccount = this.element.querySelector(".account.active");

    if (activeAccount) {
      activeAccount.classList.remove("active");
    }
    element.classList.add("active");
    const accountId = element.dataset.id;
    App.showPage("transactions", { account_id: accountId });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `
    <li class="account" data-id="${item.id}">
      <a href="#">
        <span>${item.name}</span> /
        <span>${item.sum} ₽</span>
      </a>
    </li>
    `
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItems(data){
    data.forEach(item => {
      const html = this.getAccountHTML(item);
      this.element.insertAdjacentHTML("beforeend", html);
    })
  }
}
