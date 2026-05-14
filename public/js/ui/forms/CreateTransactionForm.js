/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      if (err) {
        console.error("Ошибка загрузки счетов", err);
        return;
      }
      
      const selectElement = this.element.querySelector('select[name="account_id"]');
      
      if (!selectElement) {
        console.error("Элемент select для счетов не найден");
        return;
      }
      
      selectElement.innerHTML = "";

      if (response.data.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Нет доступных счетов";
        selectElement.appendChild(option);
        return;
      }
      
      response.data.forEach(account => {
        const option = document.createElement("option");
        option.value = account.id;
        option.textContent = account.name;
        selectElement.appendChild(option);
      });
    });
  }
  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        this.element.reset();

        const modal = this.element.closest(".modal");
        if (modal) {
          modal.classList.remove("");
        }

        App.update();
      } else {
        console.error("Ошибка создания транзакции");
      }
      
      if (err) {
        console.error("Ошибка создания транзакции:", err);
        return;
      }
    });
  }
}