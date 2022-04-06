// const { Gio } = imports.gi;

const Config = imports.misc.config;

const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major, 10);

class System {
    constructor(filePath) {
        this.usage = 0;
        this.filePath = filePath;

        this.refresh();
    }

    // eslint-disable-next-line class-methods-use-this
    refresh() {
        console.log('Hello');
    }

    loadFileData() {
        // return Gio.File.new_for_path(this.filePath);
    }
}

var _sys = new System();
console.log(_sys.usage);
