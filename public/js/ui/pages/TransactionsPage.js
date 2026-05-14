/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error("Ошибка: передан пустой элемент в конструктор");
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if(this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountButton = this.element.querySelector(".remove-account");

    if (removeAccountButton) {
      removeAccountButton.addEventListener("click", () => {
        this.removeAccount();
      });
    }

    const transactionContent = this.element.querySelector(".transactions-content");
    
    if (transactionContent) {
      transactionContent.addEventListener("click", event => {
      const button = event.target.closest(".transaction__remove");
      
      if (button) {
        const transactionId = button.getAttribute("data-id");
        this.removeTransaction(transactionId);
      }
    });
  }
  }


  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions || this.lastOptions.account_id) {
      return;
    }

    const confirmed = confirm("Вы действительно хотите удалить счёт?");
    if (!confirmed) {
      return;
    }

    Account.remove({id: this.lastOptions.account_id}, (err, response) => {
      if (!err) {
        this.clear();
        App.updateWidgets();
        App.updateForms();
      } else {
        console.error("Ошибка при удалении счета: ", err)
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const confirmed = confirm("Вы действительно хотите удалить эту транзакцию?");
    if (!confirmed) {
      return;
    }

    Transaction.remove({id: id}, (err,response) => {
      if (!err) {
        App.update();
      } else {
        console.error("Ошибка при удалении транзакции: ", err)
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      return;
    }

    this.lastOptions = options;
    Account.get(options.account_id, (err, account) => {
      if (!err && account) {
        this.renderTitle(account.name);
      } else {
        console.error("Ошибка при получении данных счета: ", err)
      }
    });

    Transaction.list({account_id: options.account_id}, (err,data) => {
      if (!err) {
        this.renderTransactions(data);
      } else {
        console.error("Ошибка при получении списка транзакций: ", err);
        this.renderTransactions([]);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счета");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const titleElement = this.element.querySelector(".content-title");
    
    if (titleElement) {
      titleElement.textContent = name;
    }
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(dateString){
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = ["января", "февраля",
      "марта", "апреля",
      "мая", "июня",
      "июля", "августа",
      "сентября", "октября",
      "ноября", "декабря"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const formattedDate = this.formatDate(item.created_at);
    const transactionClass = item.type === 'income' ? 'transaction--income' : 'transaction--expense';
    const typeText = item.type === 'income' ? 'Доход' : 'Расход';

    return `<div class="transaction ${transactionClass}">
      <div class="transaction__info">
        <div class="transaction__type">${typeText}</div>
        <div class="transaction__date">${formattedDate}</div>
      </div>
      <div class="transaction__amount">${item.sum} руб.</div>
      <button class="transaction__remove" data-id="${item.id}">×</button>
    </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentElement = this.element.querySelector(".content");

    if (!contentElement) {
      return;
    }

    if (data && data.length > 0) {
      const transactionHTMLs = data.map(item => this.getTransactionHTML(item));
      const html = transactionHTMLs.join("");
      contentElement.innerHTML = html;
      } else {
        contentElement.innerHTML = "<div class='no-transactions'>Транзакций нет</div>";
      }
    }
  }