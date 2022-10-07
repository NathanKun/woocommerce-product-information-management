import com.github.gradle.node.task.NodeTask

plugins {
  java
  id("com.github.node-gradle.node") version "3.4.0"
}

group = "com.catprogrammer"
version = "1.0"
java.sourceCompatibility = JavaVersion.VERSION_11

node {
  version.set("16.13.1")
  npmVersion.set("8.0.0")
  yarnVersion.set("1.22.5")
  download.set(true)
}

tasks.register<NodeTask>("angular_build") {
  dependsOn("yarn_install")
  script.set(file("node_modules/@angular/cli/bin/ng.js"))
  args.set(listOf("build", "--configuration", "production"))
  options.set(listOf("--max_old_space_size=8192"))
}
