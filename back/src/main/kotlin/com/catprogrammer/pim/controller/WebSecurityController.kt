/*
package com.catprogrammer.pim.controller

import org.springframework.http.HttpStatus
import org.springframework.security.web.DefaultRedirectStrategy
import org.springframework.security.web.RedirectStrategy
import org.springframework.security.web.savedrequest.HttpSessionRequestCache
import org.springframework.security.web.savedrequest.RequestCache
import org.springframework.util.StringUtils
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.lang.Exception
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@RestController
class WebSecurityController {
    // 原请求信息的缓存及恢复
    private val requestCache: RequestCache = HttpSessionRequestCache()

    // 用于重定向
    private val redirectStrategy: RedirectStrategy = DefaultRedirectStrategy()

    /**
     * 当需要身份认证的时候，跳转过来
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/authentication/require")
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    @Throws(
        Exception::class
    )
    fun requireAuthentication(request: HttpServletRequest?, response: HttpServletResponse?): String {
        val savedRequest = requestCache.getRequest(request, response)
        if (savedRequest != null) {
            val targetUrl = savedRequest.redirectUrl
            if (StringUtils.endsWithIgnoreCase(targetUrl, ".html")) {
                redirectStrategy.sendRedirect(request, response, "/login.html")
            }
        }
        return "访问的服务需要身份认证，请引导用户到登录页"
    }
}
*/
