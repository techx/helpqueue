from sqlalchemy import Table, Integer, Column, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from server.app import db

Base = db.Model

def remove_from_db(objs):
    """Removes objects from database
    
    Arguments:
        objs {List} -- of models
    """
    for obj in objs:
        db.session.delete(obj)
    db.session.commit()
def add_to_db(obj, others=None,rollbackfunc=None):
    """Adds objects to database
    
    Arguments:
        obj {Model} -- Object wanting to add
    
    Keyword Arguments:
        others {List} -- List of other model objects (default: {None})
        rollbackfunc {Func} -- Function that should be called on rollback (default: {None})
    
    Returns:
        Boolean - Success or not successful
    """
    retry = 10
    committed = False
    while (not committed and retry > 0):
        try:
            db.session.add(obj)
            if (others):
                for o in others:
                    db.session.add(o)
            db.session.commit()
        except exc.IntegrityError:
            db.session.rollback()
            if (rollbackfunc):
                rollbackfunc()
            else:
                retry = 0
            retry -= 1
        else:
            committed = True
    return committed