package com.catprogrammer.pim.service

import com.amazonaws.auth.AWSCredentials
import com.amazonaws.auth.AWSStaticCredentialsProvider
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.model.S3ObjectInputStream
import com.amazonaws.util.IOUtils
import com.catprogrammer.pim.config.AwsS3Config
import org.springframework.stereotype.Service
import java.io.File
import java.io.IOException

import javax.annotation.PostConstruct
import kotlin.jvm.Throws


@Service
class S3Service(private val awsS3Config: AwsS3Config) {
    private lateinit var s3Client: AmazonS3

    @PostConstruct
    private fun initializeAmazon() {
        val credentials: AWSCredentials = BasicAWSCredentials(awsS3Config.accessKey, awsS3Config.secretKey)
        s3Client = AmazonS3ClientBuilder.standard().withCredentials(AWSStaticCredentialsProvider(credentials))
            .withRegion(Regions.EU_WEST_3).build()
    }

    fun uploadPhoto(key: String, file: File) {
        s3Client.putObject(awsS3Config.bucketName, key, file)
    }

    @Throws(IOException::class)
    fun downloadPhoto(key: String): ByteArray {
        val s3object: S3Object = s3Client.getObject(awsS3Config.bucketName, key)
        val inputStream: S3ObjectInputStream = s3object.objectContent
        return IOUtils.toByteArray(inputStream)
    }

    fun deleteFile(key: String?) {
        s3Client.deleteObject(awsS3Config.bucketName, key)
    }
}
