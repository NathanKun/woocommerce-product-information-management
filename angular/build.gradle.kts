import com.moowork.gradle.node.task.NodeTask

plugins {
  java
  id("com.github.node-gradle.node") version "2.2.4"
}

group = "com.catprogrammer"
version = "1.0"
java.sourceCompatibility = JavaVersion.VERSION_11

node {
  version = "16.13.1"
  npmVersion = "8.0.0"
  yarnVersion = "1.22.5"
  download = true
}

tasks.register<NodeTask>("angular_build") {
  dependsOn("yarn_install")
  script = file("node_modules/@angular/cli/bin/ng.js")
  addArgs("build", "--configuration", "production")
  options = listOf("--max_old_space_size=8192")
}
