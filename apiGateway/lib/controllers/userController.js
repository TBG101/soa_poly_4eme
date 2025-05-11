export const userController = {
    getUser: (userClient, user) =>
        new Promise((resolve, reject) => {
            const { id } = user;
            if (!id) {
                return reject(new Error("Unauthorized"));
            }
            userClient.GetUser({ id }, (err, response) => {
                if (err) reject(err);
                resolve(response);
            });
        }),

    createUser: (userClient, username, password) =>
        new Promise((resolve, reject) => {
            userClient.CreateUser({ username, password }, (err, response) => {
                if (err) reject(err);
                resolve(response);
            });
        }),

    login: (userClient, username, password) =>
        new Promise((resolve, reject) => {
            userClient.Login({ username, password }, (err, response) => {
                if (err) return reject(err);
                if (response && response.token) {
                    resolve({ token: response.token });
                } else {
                    reject(new Error("Invalid login response"));
                }
            });
        }),
};
