const ByteArray = imports.byteArray;
const Config = imports.misc.config;

const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major, 10);

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const { System } = Extension.imports.system.system;

// eslint-disable-next-line
var Memory = class Memory extends System {
    constructor() {
        super('/proc/meminfo');
    }

    // eslint-disable-next-line class-methods-use-this
    usagePercent(active, total) {
        return 100 * (active / total);
    }

    // eslint-disable-next-line class-methods-use-this
    parsing(contents) {
        const procTextData = shellVersion >= 41
            ? new TextDecoder('utf-8').decode(contents)
            : ByteArray.toString(contents);

        const memInfo = procTextData
            .split('\n')
            .map(n => n.substring(0, n.length - 3)
                .split(':')[1]);

        const [
            totalMem,
            freeMem,
        ] = memInfo.slice(0, 2)
            .map(n => parseInt(n.trim(), 10));

        const active = totalMem - freeMem;
        const total = totalMem;
        return [active, total];
    }
};