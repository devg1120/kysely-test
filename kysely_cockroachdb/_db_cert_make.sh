cockroach cert create-ca --certs-dir=certs --ca-key=ca.key
cockroach cert create-node localhost $(hostname) --certs-dir=certs --ca-key=ca.key
cockroach cert create-client root --certs-dir=certs --ca-key=ca.key


