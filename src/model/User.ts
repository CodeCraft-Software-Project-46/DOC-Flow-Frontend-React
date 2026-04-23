export class User {
    id: string;
    username: string;
    name: string;
    email: string;
    contact_number: string;
    address: string;
    role: string | null;
    department: string;

    constructor(data: {
        id:string;
        username: string;
        email: string;
        name?: string;
        contact_number?: string;
        address?: string;
        role?: string | null;
        department?: string;
    }) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.name = data.name ?? "";
        this.contact_number = data.contact_number ?? "";
        this.address = data.address ?? "";
        this.role = data.role ?? null;
        this.department = data.department ?? "";
    }
}