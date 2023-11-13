import { storage, tokenTableName,userIdTableName } from '@/config'
import cookie from 'js-cookie'

/**
 * @description 获取token
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTableName)
    } else if ('cookie' === storage) {
      return cookie.get(tokenTableName)
    } else {
      return localStorage.getItem(tokenTableName)
    }
  } else {
    return localStorage.getItem(tokenTableName)
  }
}

export function getUserId() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(userIdTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(userIdTableName)
    } else if ('cookie' === storage) {
      return cookie.get(userIdTableName)
    } else {
      return localStorage.getItem(userIdTableName)
    }
  } else {
    return localStorage.getItem(userIdTableName)
  }
}

/**
 * @description 存储token
 * @param token
 * @returns {void|*}
 */
export function setToken(token) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenTableName, token)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenTableName, token)
    } else if ('cookie' === storage) {
      return cookie.set(tokenTableName, token)
    } else {
      return localStorage.setItem(tokenTableName, token)
    }
  } else {
    return localStorage.setItem(tokenTableName, token)
  }
}

export function setUserId(userId) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(userIdTableName, userId)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(userIdTableName, userId)
    } else if ('cookie' === storage) {
      return cookie.set(userIdTableName, userId)
    } else {
      return localStorage.setItem(userIdTableName, userId)
    }
  } else {
    return localStorage.setItem(userIdTableName, userId)
  }
}



/**
 * @description 移除token
 * @returns {void|Promise<void>}
 */
export function removeToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else if ('cookie' === storage) {
      return cookie.remove(tokenTableName)
    } else {
      return localStorage.removeItem(tokenTableName)
    }
  } else {
    return localStorage.removeItem(tokenTableName)
  }
}

export function removeUserId() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(userIdTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else if ('cookie' === storage) {
      return cookie.remove(userIdTableName)
    } else {
      return localStorage.removeItem(userIdTableName)
    }
  } else {
    return localStorage.removeItem(userIdTableName)
  }
}
