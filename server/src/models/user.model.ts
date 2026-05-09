export type { User }

export { createUser, findUserById, findUserByName}

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

const users: User[] = [
    {id: 0, name: "Goro", email: "i@g", password: "3"}
]

function createUser(name: string, email: string, password: string) {
    users.push({id: users.length + 1, name, email, password});
}

function findUserById(id : number) : User | undefined {
    return users[id];
}

function findUserByName(name: string) {
    return users.find(u => u.name === name);
}