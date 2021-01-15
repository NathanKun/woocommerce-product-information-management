import com.moowork.gradle.node.yarn.YarnTask

plugins {
  java
  id("com.github.node-gradle.node") version "2.2.4"
}

group = "com.catprogrammer"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

node {
  version = "12.19.1"
  npmVersion = "6.14.8"
  yarnVersion = "1.22.5"
  download = true
}

tasks.register<YarnTask>("angular_build") {
  dependsOn("yarn_install")
  args = listOf("build", "--prod")
}
