/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = "/user";
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const userAuthoriz = localStorage.getItem("user");
    return userAuthoriz ? JSON.parse(userAuthoriz) : undefined;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({
      url: `${this.URL}/current"`,
      method: "GET",
      callback: (err, response) => {
        if (err) {
          console.error("Ошибка загрузки пользователя: ", err);
          callback(err, response);
          return;
        }

        if (!response || !response.success) {
          this.unsetCurrent();
          callback(null, {success: false, error: "Пользователь не авторизован"});
          return;
        }

        this.setCurrent(response.user);
        callback(null, response);
      }
    });
  }
  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: `${this.URL}/login`,
      method: 'POST',
      responseType: 'json',
      data: data,
      callback: (err, response) => {
        if (err) {
          callback(err, response);
          return;
        }

        if (response && response.success && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: `${this.URL}/register`,
      method: "POST",
      data: data,
      callback: (err, response) => {
        if (err) {
          callback(err, response);
          return;
        }
        
        if (response && response.success && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: `${this.URL}/logout"`,
      method: "POST",
      callback: (err, response) => {
        this.unsetCurrent();
        callback(err, response);
      }
    });
  }
}
