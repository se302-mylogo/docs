import random


class GaleraRouter:
    _galeras = ['galera2', 'galera3']

    def db_for_read(self, model, **hints):
        """
        Reads go to a randomly-chosen replica.
        """
        return random.choice(self._galeras)

    def db_for_write(self, model, **hints):
        """
        Writes always go to primary.
        """
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations between objects are allowed if both objects are
        in the primary/replica pool.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All non-auth models end up in this pool.
        """
        return True
