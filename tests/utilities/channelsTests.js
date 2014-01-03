define(['underscore', 'chai', 'mocha', 'sinon', 'sinonChai', 'squire'],
    function (_, chai, mocha, sinon, sinonChai, Squire) {

        'use strict';

        var injector = new Squire();

        chai.should();

        require(['sinonCall', 'sinonSpy']);
        // Using Sinon-Chai assertions for spies etc. https://github.com/domenic/sinon-chai
        chai.use(sinonChai);
        mocha.setup('bdd');

        describe('Channels', function() {

            var Channels;

            beforeEach(function (done) {
                injector.require(['../app/utilities/channels'], function (ChannelsDep) {
                    Channels = ChannelsDep;
                    done();
                });
            });

            it('channels itself can be used as an event bus', function() {
                var channels = new Channels(),
                    spy1 = sinon.spy();

                channels.on('test', spy1);

                channels.trigger('test');

                spy1.should.have.been.calledOnce;
            });

            it('channels can be instantiated with a namespace string', function() {
                var channels = new Channels('test1'),
                    spy1 = sinon.spy();

                channels.test1.on('test', spy1);

                channels.test1.trigger('test');

                spy1.should.have.been.calledOnce;
            });

            it('channels can be instantiated with a namespace array', function() {
                var channels = new Channels(['test1', 'test2']),
                    spy1 = sinon.spy(),
                    spy2 = sinon.spy();

                channels.test1.on('test', spy1);
                channels.test2.on('test', spy2);

                channels.test1.trigger('test');
                channels.test2.trigger('test');

                spy1.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;
            });

            it('all objects in nested channels have events', function() {
                var channels = new Channels(),
                    spy1 = sinon.spy(),
                    spy2 = sinon.spy(),
                    spy3 = sinon.spy(),
                    spy4 = sinon.spy();

                channels.addChannel('test1.test2.test3');
                channels.on('test', spy1);
                channels.test1.on('test', spy2);
                channels.test1.test2.on('test', spy3);
                channels.test1.test2.test3.on('test', spy4);

                channels.trigger('test');
                channels.test1.trigger('test');
                channels.test1.test2.trigger('test');
                channels.test1.test2.test3.trigger('test');

                spy1.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;
                spy3.should.have.been.calledOnce;
                spy4.should.have.been.calledOnce;
            });

            it('should be a singleton', function(done) {
                var channels1, channels2, spy;
                injector.require(['../app/utilities/channels'], function (ChannelsDep1) {
                    channels1 = new ChannelsDep1('testor');
                    injector.require(['../app/utilities/channels'], function (ChannelsDep2) {
                        channels2 = new ChannelsDep2('testor');
                        spy = sinon.spy();

                        channels2.testor.on('ping', spy);
                        spy.should.not.have.been.called;
                        channels1.testor.trigger('ping');
                        spy.should.have.been.calledOnce;
                        done();
                    });
                });
            });

        });
    });
