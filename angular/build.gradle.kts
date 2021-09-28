import com.moowork.gradle.node.task.NodeTask

plugins {
  java
  id("com.github.node-gradle.node") version "2.2.4"
}

group = "com.catprogrammer"
version = "1.0"
java.sourceCompatibility = JavaVersion.VERSION_11

node {
  version = "12.19.1"
  npmVersion = "6.14.8"
  yarnVersion = "1.22.5"
  download = true
}

tasks.register<NodeTask>("angular_build") {
  dependsOn("yarn_install")
  script = file("node_modules/@angular/cli/bin/ng")
  addArgs("build", "--configuration", "production")
  options = listOf("--max_old_space_size=8192")
}
