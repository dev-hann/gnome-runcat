const ByteArray = imports.byteArray;
const Config = imports.misc.config;

const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major, 10);

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const { System } = Extension.imports.system.system;

// eslint-disable-next-line
var Cpu = class Cpu extends System {
    constructor() {
        super('/proc/stat');
        this.lastActive = 0;
        this.lastTotal = 0;
    }

    usagePercent(active, total) {
        const percent = 100 * ((active - this.lastActive) / (total - this.lastTotal));
        this.lastActive = active;
        this.lastTotal = total;
        return percent;
    }

    // eslint-disable-next-line class-methods-use-this
    parsing(contents) {
        const procTextData = shellVersion >= 41
            ? new TextDecoder('utf-8').decode(contents)
            : ByteArray.toString(contents);
        const cpuInfo = procTextData
            .split('\n')
            .shift()
            .trim()
            .split(/[\s]+/)
            .map(n => parseInt(n, 10));

        const [
            , // eslint-disable-line
            user,
            nice,
            sys,
            idle,
            iowait,
            irq, // eslint-disable-line
            softirq,
            steal,
            guest, // eslint-disable-line
        ] = cpuInfo;

        const active = user + sys + nice + softirq + steal;
        const total = user + sys + nice + softirq + steal + idle + iowait;
        return [active, total];
    }
};