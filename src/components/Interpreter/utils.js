import { Subject, Observable, combineLatest, of } from "rxjs"
import { map } from "rxjs/operators"

export const forEach_async = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

export const get_async = async (object, path, defaultValue) => {
    let index = 0
    const length = path.length
  
    while (object !== null && index < length) {
        object = await object[path[index++]]
    }
    return (index && (index === length)) ? object : defaultValue
}

export const combineLatestObj = (obj) => {
    var sources = []
    var keys = []
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            sources.push(obj[key])
        }
    }
    return combineLatest(sources, () => {
        var argsLength = arguments.length
        var combination = {}
        for (var i = argsLength - 1; i >= 0; i--) {
            combination[keys[i]] = arguments[i]
        }
        return combination;
    })
  }