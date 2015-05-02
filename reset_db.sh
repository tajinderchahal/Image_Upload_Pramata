export PGPASSWORD="pramata"; psql -U pramata pramata -c 'drop schema public cascade;'
export PGPASSWORD="pramata"; psql -U pramata pramata -c 'create schema public;'
for d in */ ; do
        x=$d'migrations/*.pyc'
        y=$d'migrations/*.py'
        z=$d'migrations/__init__.py'
        rm $x
        rm $y
        touch $z
done

./manage.py makemigrations
./manage.py migrate

