import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    id("org.springframework.boot") version "2.6.6"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("com.github.ben-manes.versions") version "0.42.0" // dep update: gradlew dependencyUpdates -Drevision=release

    kotlin("jvm") version "1.6.20"
    kotlin("plugin.spring") version "1.6.20"
    kotlin("plugin.jpa") version "1.6.20"
}

group = "com.catprogrammer"
version = "1.1.3"
java.sourceCompatibility = JavaVersion.VERSION_11

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("mysql:mysql-connector-java")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")

    // implementation("de.codecentric:spring-boot-admin-starter-client:2.3.1") // spring boot admin client

    val awsVersion = "1.12.191"
    implementation("com.amazonaws:aws-java-sdk-core:${awsVersion}")
    implementation("com.amazonaws:aws-java-sdk-s3:${awsVersion}")

    implementation("com.squareup.okhttp3:okhttp:4.9.3")
    implementation("oauth.signpost:signpost-core:2.1.1")
    implementation("se.akerfeldt:okhttp-signpost:1.1.0")

    implementation(project(":angular"))
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "11"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.register<Delete>("cleanAngularCopyDestination") {
    delete("$buildDir/resources/main/static/pim")
}

tasks.register<Copy>("copyAngular") {
    dependsOn(":angular:angular_build", "cleanAngularCopyDestination")

    from("../angular/dist/pim")
    into("$buildDir/resources/main/static/pim")
}

val jarFilename = "pim.jar"

val packageZip by tasks.register<Zip>("packageZip") {
    archiveFileName.set("pim.zip")
    destinationDirectory.set(layout.buildDirectory.dir("libs"))

    from("$buildDir/libs/$jarFilename")

    from("../.ebextensions") {
        into(".ebextensions")
    }
    from("../.platform") {
        into(".platform")
    }
}

tasks.register<Delete>("cleanLibs") {
    delete("$buildDir/libs/")
}

tasks.named("bootJarMainClassName") {
    dependsOn("copyAngular") // get rid of the dependency warning
}

tasks.named<BootJar>("bootJar") {
    dependsOn("copyAngular", "cleanLibs")

    this.archiveFileName.set(jarFilename)

    finalizedBy(packageZip)
}
