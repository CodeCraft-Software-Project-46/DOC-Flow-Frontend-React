
export class Role {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    userCount?: number;

    constructor(
        id: string,
        name: string,
        permissions: string[] = [],
        description?: string,
        userCount: number = 0
    ) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
        this.description = description;
        this.userCount = userCount;
    }
}