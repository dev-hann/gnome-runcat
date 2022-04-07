const { Gio } = imports.gi;

// eslint-disable-next-line no-unused-vars
var System = class System {
    constructor(filePath) {
        this.filePath = filePath;
        this.refresh();
    }

    loadContents() {
        const file = Gio.File.new_for_path(this.filePath);
        return file.load_contents(null);
    }

    // eslint-disable-next-line class-methods-use-this
    usagePercent(active, total) {
    }

    // eslint-disable-next-line class-methods-use-this
    parsing(contents) {
    }

    // eslint-disable-next-line class-methods-use-this
    refresh() {
        const [success, contents] = this.loadContents();
        if (!success) {
            throw new Error(`Can't load contents of stat file : ${this.filePath}`);
        }
        const [active, total] = this.parsing(contents);
        const utilization = this.usagePercent(active, total);
        this.usage = utilization;
        return this.usage;
    }
};