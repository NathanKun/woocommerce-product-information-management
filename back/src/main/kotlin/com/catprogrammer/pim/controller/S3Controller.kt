package com.catprogrammer.pim.controller

import com.amazonaws.services.s3.model.AmazonS3Exception
import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.exception.RequestParamException
import com.catprogrammer.pim.service.S3Service
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileOutputStream
import java.io.IOException


@RequestMapping("/api/s3")
@RestController
class S3Controller(private val s3Service: S3Service) {

    private val logger = LoggerFactory.getLogger(javaClass)

    @PostMapping("/")
    fun uploadFile(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("path") path: String,
        @RequestParam("filename", required = false) name: String?
    ): RestResponse<String> {
        pathCheck(path)

        val fileObj: File = convertMultiPartToFile(file)
        val filename = name ?: (file.originalFilename ?: "unknownFileName")

        val key = buildKey(filename, path)

        logger.info("Upload file to S3: $key")

        s3Service.uploadPhoto(key, fileObj)
        fileObj.delete()

        return RestResponse.ok()
    }

    @GetMapping("/")
    fun downloadFile(
        @RequestParam("filename") filename: String,
        @RequestParam("path") path: String
    ): ResponseEntity<ByteArray> {
        pathCheck(path)

        val key = buildKey(filename, path)

        logger.info("Download file from S3: $key")

        val content: ByteArray = s3Service.downloadPhoto(key)

        return ResponseEntity.ok().header(
            HttpHeaders.CONTENT_DISPOSITION,
            """attachment; filename="$filename""""
        ).body(content)
    }

    @DeleteMapping("/")
    fun deleteFile(
        @RequestParam("filename") filename: String,
        @RequestParam("path") path: String
    ): RestResponse<String> {
        pathCheck(path)

        val key = buildKey(filename, path)

        logger.info("Delete file from S3: $key")
        s3Service.deleteFile(filename)

        return RestResponse.ok()
    }

    @Throws(RequestParamException::class)
    private fun pathCheck(path: String) {
        if (path.startsWith("/")) {
            throw RequestParamException("path must not starts with /")
        }
    }

    @Throws(IOException::class)
    private fun convertMultiPartToFile(file: MultipartFile): File {
        val convFile = File(file.originalFilename ?: "unknownFileName")
        val fos = FileOutputStream(convFile)
        fos.write(file.bytes)
        fos.close()
        return convFile
    }

    private fun buildKey(filename: String, path: String): String {
        return if (path.isNotEmpty() && !path.endsWith("/")) {
            "$path/$filename"
        } else {
            path + filename
        }
    }

    @ExceptionHandler(value = [AmazonS3Exception::class])
    fun handleAwsException(e: AmazonS3Exception): RestResponse<String> {
        val msg = "AmazonS3Exception: ${e.message}"
        logger.warn(msg, e)
        return RestResponse.failResponse(msg)
    }

    @ExceptionHandler(value = [IOException::class])
    fun handleAwsException(e: IOException): RestResponse<String> {
        val msg = "IOException: ${e.message}"
        logger.warn(msg, e)
        return RestResponse.failResponse(msg)
    }
}
