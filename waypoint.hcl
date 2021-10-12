project = "social-network"

    app "social-network" {
        build {
            use "pack" {}
            registry {
                use "docker" {
                    image = "social-network"
                    tag = "1"
                    local = true
                }
            }
        }

        deploy {
            use "nomad" {
                datacenter = "dc1"
            }
        }
    }