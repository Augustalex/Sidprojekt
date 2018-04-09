module.exports = function (controller, plugins, pluginDeps) {
    let wrappedController = { ...controller };
    let pluginInReverseOrder = plugins.slice().reverse();
    for (let key of Object.keys(wrappedController)) {
        for (let plugin of pluginInReverseOrder) {
            wrappedController[key] = plugin(wrappedController[key], pluginDeps);
        }
    }
    return wrappedController;
};