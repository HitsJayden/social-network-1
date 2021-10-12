job "social-network" {
    datacenters = ["dc1"]
    type = "service"

    constraint {
        attribute = "${meta.node_type}"
        value = "agent"
    }

    vault {
        policies = ["social-network"]
    }

    group "website-group" {
        count = 1
        update {
            min_healthy_time = "30s"
            auto_revert = true
            health_check = "checks"
        }

        network {
            port "frontend" {
                to = 3000
            }
            port "backend" {
                to = 5000
            }
        }

        task "frontend" {
            driver = "docker"

            resources {
                cpu = 1500
                memory = 1024
            }

            config {
                ports = ["frontend"]
                image = "registry.service.consul:5000/social-network-frontend:27"
            }

            template {
                data = <<EOF
                    {{ with secret "kv/social-network" }}
                    CLOUDINARY="{{ .Data.CLOUDINARY }}"
                    NEXT_PUBLIC_API_URL="{{ .Data.NEXT_PUBLIC_API_URL }}"
                    PRESET="{{ .Data.PRESET }}"
                    {{ end }}
                EOF
                destination = "secrets/social-network.env"
                env = true
            }

            service {
                name = "social-network-frontend"
                tags = [
                    "traefik.enable=true",
                    "traefik.http.middlewares.social-network-web.redirectscheme.scheme=https",
                    "traefik.http.routers.social-network-frontend.middlewares=social-network-web",
                    "traefik.http.routers.social-network-frontend.rule=Host(`social-network.ansorren.unmanaged.io`)",
                    "traefik.http.routers.social-network-web.rule=Host(`social-network.ansorren.unmanaged.io`)",
                    "traefik.http.routers.social-network-web.tls=true",
                ]
                port = "frontend"
                check {
                    type = "http"
                    port = "frontend"
                    interval = "10s"
                    timeout = "2s"
                    path = "/"
                }
            }
        }

        task "backend" {
            driver = "docker"

            resources {
                cpu = 1500
                memory = 1024
            }

            config {
                ports = ["backend"]
                image = "registry.service.consul:5000/social-network-backend:27"
            }

            template {
                data = <<EOF
                {{ with secret "kv/social-network" }}
                    MAIL_PASS={{ .Data.MAIL_PASS }}
                    MAIL_USER={{ .Data.MAIL_USER }}
                    MONGODB={{ .Data.MONGODB }}
                    PORT={{ .Data.PORT }}
                    SESSION_SECRET={{ .Data.SESSION_SECRET }}
                    TOKEN_SECRET={{ .Data.TOKEN_SECRET }}
                    WEAK_TOKEN_SECRET={{ .Data.WEAK_TOKEN_SECRET }}
                    URL={{ .Data.URL }}
                    DOMAIN={{ .Data.DOMAIN }}
                    {{ end }}
                EOF
                destination = "secrets/social-network.env"
                env = true
            }

            service {
                name = "social-network-backend"
                tags = [
                    "traefik.enable=true",
                    "traefik.http.middlewares.social-network-backend2.redirectscheme.scheme=https",
                    "traefik.http.routers.social-network-backend1.middlewares=social-network-backend2",
                    "traefik.http.routers.social-network-backend1.rule=Host(`social-network-backend.ansorren.unmanaged.io`)",
                    "traefik.http.routers.social-network-backend2.rule=Host(`social-network-backend.ansorren.unmanaged.io`)",
                    "traefik.http.routers.social-network-backend2.tls=true",
                ]
                port = "backend"
            }
        }
    }
}