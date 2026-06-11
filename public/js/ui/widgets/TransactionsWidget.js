/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Ошибка: переданный элемент не существует");
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeButton = this.element.querySelector(".create-income-button");

    if (incomeButton) {
      incomeButton.addEventListener("click", function() {
        console.log("Клик по кнопке дохода");
        const modal = App.getModal("newIncome");
        console.log("Полученный модальный объект:", modal);  ////
        if (modal) {
          modal.open();
        }
      });
    }

    const expenseButton = this.element.querySelector(".create-expense-button");
    
    if (expenseButton) {
      expenseButton.addEventListener("click", function() {
        const modal = App.getModal("newExpense");
        console.log("Полученный модальный объект:", modal);  ////
        if (modal) {
          modal.open();
        }
      });
    }
  }
}
