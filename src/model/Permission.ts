export class Permission {
    permission_id: number;
    permission_name: string;
    permission_description: string;
    category: string;

    constructor(
        permission_id: number,
        permission_name: string,
        permission_description: string,
        category: string
    ) {
        this.permission_id = permission_id;
        this.permission_name = permission_name;
        this.permission_description = permission_description;
        this.category = category;
    }
}