export const defaults = [
    { key: 'base-tiles', resource: require('./floor.png'), type: 'image' },
    { key: 'selected', resource: require('./selected.png'), type: 'image'},
    { key: 'player', resource: require('./meeple.png'), type: 'image'},
    { key: 'tiny2', resource: require('./patterns/beige.png'), type: 'image', data:{}},
]

export const Icons = {
    objectEdit: require('./icon/edit-object.png'),
    tileEdit: require('./icon/edit-tiles.png'),
    stopEdit: require('./icon/stop-edit.png'),
    roomEdit: require('./icon/edit.png'),
    remove: require('./icon/remove.png'),
    home: require('./icon/home.png'),
    search: require('./icon/search.png'),
    logout: require('./icon/logout.png'),
    caution: require('./ui/caution.png'),
    info: require('./ui/info.png')
}

export const CSSTiles = require('./floor.png')